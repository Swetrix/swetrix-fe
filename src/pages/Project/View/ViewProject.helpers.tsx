import React from 'react'
// @ts-ignore
import { saveAs } from 'file-saver'
import {
  GlobeEuropeAfricaIcon, LanguageIcon, DocumentTextIcon, DeviceTabletIcon,
  ArrowRightCircleIcon, MagnifyingGlassIcon, ServerIcon,
} from '@heroicons/react/24/outline'
// @ts-ignore
import * as d3 from 'd3'
import dayjs from 'dayjs'
import {
  area, areaSpline, spline, bar,
} from 'billboard.js'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _split from 'lodash/split'
import _replace from 'lodash/replace'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _size from 'lodash/size'
import _round from 'lodash/round'
import _fill from 'lodash/fill'
import _reduce from 'lodash/reduce'
import _last from 'lodash/last'
import JSZip from 'jszip'

import {
  TimeFormat, chartTypes, tbsFormatMapper, tbsFormatMapper24h,
} from 'redux/constants'
import { getTimeFromSeconds, getStringFromTime, sumArrays } from 'utils/generic'
import countries from 'utils/isoCountries'
import _toNumber from 'lodash/toNumber'
import _toString from 'lodash/toString'

const getAvg = (arr: any) => {
  const total = _reduce(arr, (acc, c) => acc + c, 0)
  return total / _size(arr)
}

const getSum = (arr: any) => {
  return _reduce(arr, (acc, c) => acc + c, 0)
}

const transformAIChartData = (data: {
  [key: string]: any,
}) => {
  const transformedData = {
    x: [],
    sdur: [],
    uniques: [],
    visits: [],
  }

  _forEach(data, (d) => {
    if (d.x) {
      transformedData.x = d.x
    }
    if (d.sdur) {
      transformedData.sdur = d.sdur
    }
    if (d.uniques) {
      transformedData.uniques = d.uniques
    }
    if (d.visits) {
      transformedData.visits = d.visits
    }
  })

  return transformedData
}

const trendline = (data: any[]): string[] => {
  const xData = _map(_fill(new Array(_size(data)), 0), (_, i) => i + 1)
  const yData = data

  const xMean = getAvg(xData)
  const yMean = getAvg(yData)

  const xMinusxMean = _map(xData, (val) => val - xMean)
  const yMinusyMean = _map(yData, (val) => val - yMean)

  const xMinusxMeanSq = _map(xMinusxMean, (val) => val ** 2)

  const xy = []
  for (let x = 0; x < _size(data); ++x) {
    xy.push(xMinusxMean[x] * yMinusyMean[x])
  }

  const xySum = getSum(xy)

  const b1 = xySum / getSum(xMinusxMeanSq)

  const b0 = yMean - b1 * xMean

  const trendData = []
  for (let x = 0; x < _size(data); ++x) {
    const y = _round(b0 + b1 * x, 2)
    if (y < 0) {
      trendData.push(_toString(0))
    } else {
      trendData.push(_toString(y))
    }
  }

  return trendData
}

const getExportFilename = (prefix: string) => {
  // turn something like 2022-03-02T19:31:00.100Z into 2022-03-02
  const date = _split(_replace(_split(new Date().toISOString(), '.')[0], /:/g, '-'), 'T')[0]
  return `${prefix}-${date}.zip`
}

const convertToCSV = (array: any[]) => {
  let str = 'name,value,perc\r\n'

  for (let i = 0; i < _size(array); ++i) {
    let line = ''

    _forEach(array[i], (index) => {
      if (line !== '') line += ','
      line += index
    })

    str += `${line}\r\n`
  }

  return str
}

const onCSVExportClick = (data: {
  data: any,
  types: any,
}, pid: string, tnMapping: {
  [key: string]: string,
}, language: string) => {
  const { data: rowData, types } = data
  const zip = new JSZip()

  _forEach(types, (item) => {
    if (_isEmpty(rowData[item])) {
      return
    }

    const rowKeys = _keys(rowData[item])
    let total = 0

    _forEach(rowKeys, (e) => {
      total += rowData[item][e]
    })

    const csvData = _map(rowKeys, (e) => {
      const perc = _round(((rowData[item][e] / total) * 100) || 0, 2)

      if (item === 'cc') {
        const name = countries.getName(e, language)
        return [name, rowData[item][e], `${perc}%`]
      }

      return [e, rowData[item][e], `${perc}%`]
    })

    zip.file(`${tnMapping[item]}.csv`, convertToCSV(csvData))
  })

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, getExportFilename(`swetrix-${pid}`))
  })
}

const CHART_METRICS_MAPPING = {
  unique: 'unique',
  views: 'views',
  bounce: 'bounce',
  viewsPerUnique: 'viewsPerUnique',
  trendlines: 'trendlines',
  sessionDuration: 'sessionDuration',
  customEvents: 'customEvents',
}

const CHART_METRICS_MAPPING_PERF = {
  full: 'full',
  timing: 'timing',
  network: 'network',
  frontend: 'frontend',
  backend: 'backend',
}

// function to filter the data for the chart
const getColumns = (chart: {
  [key: string]: string[],
}, activeChartMetrics: {
  [key: string]: boolean,
}) => {
  const {
    views, bounce, viewsPerUnique, unique, trendlines, sessionDuration,
  } = activeChartMetrics

  const columns: any[] = []

  if (unique) {
    columns.push({
      id: 'unique',
      color: '#2563EB',
      data: _map(chart.uniques, (el, index) => ({
        x: dayjs(chart.x[index]).toDate(),
        y: _toNumber(el),
      })),
    })
    if (trendlines) {
      columns.push({
        id: 'trendlineUnique',
        color: '#436abf',
        data: _map(trendline(chart.uniques), (el, index) => ({
          x: dayjs(chart.x[index]).toDate(),
          y: _toNumber(el),
        })),
      })
    }
  }

  if (views) {
    columns.push({
      id: 'total',
      color: '#D97706',
      data: _map(chart.visits, (el, index) => ({
        x: dayjs(chart.x[index]).toDate(),
        y: _toNumber(el),
      })),
    })
    if (trendlines) {
      columns.push({
        id: 'trendlineTotal',
        color: '#eba14b',
        data: _map(trendline(chart.visits), (el, index) => ({
          x: dayjs(chart.x[index]).toDate(),
          y: _toNumber(el),
        })),
      })
    }
  }

  if (bounce) {
    const bounceArray = _map(chart.uniques, (el, i) => {
      return _round((_toNumber(el) * 100) / _toNumber(chart.visits[i]), 1) || 0
    })
    columns.push({
      id: 'bounce',
      color: '#2AC4B3',
      data: _map(bounceArray, (el, index) => ({
        x: dayjs(chart.x[index]).toDate(),
        y: _toNumber(el),
      })),
    })
  }

  if (viewsPerUnique) {
    const viewsPerUniqueArray = _map(chart.visits, (el, i) => {
      if (chart.uniques[i] === '0' || chart.uniques[i] === undefined) {
        return 0
      }
      return _round(_toNumber(el) / _toNumber(chart.uniques[i]), 1)
    })
    columns.push({
      id: 'viewsPerUnique',
      color: '#F87171',
      data: _map(viewsPerUniqueArray, (el, index) => ({
        x: dayjs(chart.x[index]).toDate(),
        y: _toNumber(el),
      })),
    })
  }

  if (sessionDuration) {
    columns.push({
      id: 'sessionDuration',
      color: '#c945ed',
      data: _map(chart.sdur, (el, index) => ({
        x: dayjs(chart.x[index]).toDate(),
        y: _toNumber(el),
      })),
    })
  }

  return columns
}

const getColumnsPerf = (chart: {
  [key: string]: string[],
}, activeChartMetrics: string) => {
  const columns: any[] = [
    ['x', ..._map(chart.x, el => dayjs(el).toDate())],
  ]

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.full) {
    columns.push(['dns', ...chart.dns])
    columns.push(['tls', ...chart.tls])
    columns.push(['conn', ...chart.conn])
    columns.push(['response', ...chart.response])
    columns.push(['render', ...chart.render])
    columns.push(['dom_load', ...chart.domLoad])
    columns.push(['ttfb', ...chart.ttfb])
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.timing) {
    columns.push(['frontend', ...sumArrays(chart.render, chart.domLoad)])
    columns.push(['network', ...sumArrays(chart.dns, chart.tls, chart.conn, chart.response)])
    columns.push(['backend', ...chart.ttfb])
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.network) {
    columns.push(['dns', ...chart.dns])
    columns.push(['tls', ...chart.tls])
    columns.push(['conn', ...chart.conn])
    columns.push(['response', ...chart.response])
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.frontend) {
    columns.push(['render', ...chart.render])
    columns.push(['dom_load', ...chart.domLoad])
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.backend) {
    columns.push(['ttfb', ...chart.ttfb])
  }

  return columns
}

const stringToColour = (str: string) => {
  let hash = 0

  // Loop through each character in the string
  for (let i = 0; i < str.length; i++) {
    // Get the ASCII code for the current character
    const charCode = str.charCodeAt(i)
    // Update the hash value using a simple algorithm
    hash = charCode + ((hash << 5) - hash)
  }

  // Initialise color value to #
  let colour = '#'

  // Generate 3-byte color code (RRGGBB)
  for (let i = 0; i < 3; i++) {
    // Get the next 8 bits of the hash value
    const value = (hash >> (i * 8)) & 0xFF
    // Convert the value to a 2-digit hex string
    const hexString = (`00${value.toString(16)}`).substr(-2)
    // Append the hex string to the color value
    colour += hexString
  }

  // Return the resulting color value
  return colour
}

// setting the default values for the time period dropdown
const noRegionPeriods = ['custom', 'yesterday']

// function to get the settings and data for the chart(main diagram)
const getSettings = (
  chart: any,
  timeBucket: string,
  activeChartMetrics: {
    [key: string]: boolean,
  },
  applyRegions: boolean,
  timeFormat: string,
  forecasedChartData: {
    [key: string]: string[],
  },
  rotateXAxias: boolean,
  chartType: string,
  customEvents?: {
    [key: string]: string[],
  },
) => {
  const xAxisSize = _size(chart.x)
  const lines = []
  const modifiedChart = { ...chart }
  let regions
  const customEventsToArray = customEvents ? _map(_keys(customEvents), (el) => {
    return [el, ...customEvents[el]]
  }) : []

  let customEventsColors: {
    [key: string]: string,
  } = {}

  _forEach(_keys(customEvents), (el) => {
    customEventsColors = {
      ...customEventsColors,
      [el]: stringToColour(el),
    }
  })

  if (!_isEmpty(forecasedChartData)) {
    lines.push({
      value: _last(chart?.x),
      text: 'Forecast',
    })
    modifiedChart.x = [...modifiedChart.x, ...forecasedChartData.x]
    modifiedChart.uniques = [...modifiedChart.uniques, ...forecasedChartData.uniques]
    modifiedChart.visits = [...modifiedChart.visits, ...forecasedChartData.visits]
    modifiedChart.sdur = [...modifiedChart.sdur, ...forecasedChartData.sdur]
  }

  const columns = getColumns(modifiedChart, activeChartMetrics)

  if (applyRegions) {
    let regionStart

    if (xAxisSize > 1) {
      regionStart = dayjs(chart.x[xAxisSize - 2]).toDate()
    } else {
      regionStart = dayjs(chart.x[xAxisSize - 1]).toDate()
    }

    regions = {
      unique: [
        {
          start: regionStart,
          style: {
            dasharray: '6 2',
          },
        },
      ],
      total: [
        {
          start: regionStart,
          style: {
            dasharray: '6 2',
          },
        },
      ],
      bounce: [
        {
          start: regionStart,
          style: {
            dasharray: '6 2',
          },
        },
      ],
      viewsPerUnique: [
        {
          start: regionStart,
          style: {
            dasharray: '6 2',
          },
        },
      ],
    }
  }

  return {
    data: {
      x: 'x',
      columns: [...columns, ...customEventsToArray],
      types: {
        unique: chartType === chartTypes.line ? area() : bar(),
        total: chartType === chartTypes.line ? area() : bar(),
        bounce: chartType === chartTypes.line ? spline() : bar(),
        viewsPerUnique: chartType === chartTypes.line ? spline() : bar(),
        trendlineUnique: spline(),
        trendlineTotal: spline(),
        sessionDuration: chartType === chartTypes.line ? spline() : bar(),
      },
      colors: {
        unique: '#2563EB',
        total: '#D97706',
        bounce: '#2AC4B3',
        viewsPerUnique: '#F87171',
        trendlineUnique: '#436abf',
        trendlineTotal: '#eba14b',
        sessionDuration: '#c945ed',
        ...customEventsColors,
      },
      regions,
      axes: {
        bounce: 'y2',
        sessionDuration: 'y2',
      },
    },
    grid: {
      x: {
        lines,
      },
    },
    axis: {
      x: {
        clipPath: false,
        tick: {
          fit: true,
          rotate: rotateXAxias ? 45 : 0,
          format: timeFormat === TimeFormat['24-hour'] ? (x: string) => d3.timeFormat(tbsFormatMapper24h[timeBucket])(x) : null,
        },
        localtime: timeFormat === TimeFormat['24-hour'],
        type: 'timeseries',
      },
      y2: {
        show: activeChartMetrics.bounce || activeChartMetrics.sessionDuration,
        tick: {
          format: activeChartMetrics.bounce ? (d: string) => `${d}%` : (d: string) => getStringFromTime(getTimeFromSeconds(d)),
        },
        min: activeChartMetrics.bounce ? 10 : null,
        max: activeChartMetrics.bounce ? 100 : null,
        default: activeChartMetrics.bounce ? [10, 100] : null,
      },
    },
    tooltip: {
      format: {
        title: (x: string) => d3.timeFormat(tbsFormatMapper[timeBucket])(x),
      },
      contents: {
        template: `
          <ul class='bg-gray-100 dark:text-gray-50 dark:bg-gray-700 rounded-md shadow-md px-3 py-1'>
            <li class='font-semibold'>{=TITLE}</li>
            <hr class='border-gray-200 dark:border-gray-600' />
            {{
              <li class='flex justify-between'>
                <div class='flex justify-items-start'>
                  <div class='w-3 h-3 rounded-sm mt-1.5 mr-2' style=background-color:{=COLOR}></div>
                  <span>{=NAME}</span>
                </div>
                <span class='pl-4'>{=VALUE}</span>
              </li>
            }}
          </ul>`,
      },
    },
    point: {
      focus: {
        only: xAxisSize > 1,
      },
      pattern: [
        'circle',
      ],
      r: 3,
    },
    legend: {
      usePoint: true,
      item: {
        tile: {
          width: 10,
        },
      },
    },
    area: {
      linearGradient: true,
    },
    padding: {
      right: (rotateXAxias && !(activeChartMetrics.bounce || activeChartMetrics.sessionDuration)) && 35,
      left: 40,
    },
    bindto: '#dataChart',
  }
}

const getSettingsPerf = (
  chart: {
  [key: string]: string[]
},
  timeBucket: string,
  activeChartMetrics: string,
  rotateXAxias: boolean,
  chartType: string,
) => {
  const xAxisSize = _size(chart.x)

  return {
    data: {
      x: 'x',
      xFormat: tbsFormatMapper[timeBucket],
      columns: getColumnsPerf(chart, activeChartMetrics),
      types: {
        dns: chartType === chartTypes.line ? areaSpline() : bar(),
        tls: chartType === chartTypes.line ? areaSpline() : bar(),
        conn: chartType === chartTypes.line ? areaSpline() : bar(),
        response: chartType === chartTypes.line ? areaSpline() : bar(),
        render: chartType === chartTypes.line ? areaSpline() : bar(),
        dom_load: chartType === chartTypes.line ? areaSpline() : bar(),
        ttfb: chartType === chartTypes.line ? areaSpline() : bar(),
        frontend: chartType === chartTypes.line ? areaSpline() : bar(),
        network: chartType === chartTypes.line ? areaSpline() : bar(),
        backend: chartType === chartTypes.line ? areaSpline() : bar(),
      },
      colors: {
        dns: '#EC4319',
        tls: '#F27059',
        conn: '#F7A265',
        response: '#F5D376',
        render: '#709775',
        dom_load: '#A5E6AB',
        ttfb: '#00A8E8',
        frontend: '#709775',
        network: '#F7A265',
        backend: '#00A8E8',
      },
      groups: [
        ['dns', 'tls', 'conn', 'response', 'render', 'dom_load', 'ttfb', 'frontend', 'network', 'backend'],
      ],
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: tbsFormatMapper[timeBucket],
          rotate: rotateXAxias ? 45 : 0,
        },
      },
      y: {
        tick: {
          format: (d: string) => getStringFromTime(getTimeFromSeconds(d), true),
        },
      },
    },
    tooltip: {
      format: {
        title: (x: string) => d3.timeFormat(tbsFormatMapper[timeBucket])(x),
      },
      contents: {
        template: `
          <ul class='bg-gray-100 dark:text-gray-50 dark:bg-gray-700 rounded-md shadow-md px-3 py-1'>
            <li class='font-semibold'>{=TITLE}</li>
            <hr class='border-gray-200 dark:border-gray-600' />
            {{
              <li class='flex justify-between'>
                <div class='flex justify-items-start'>
                  <div class='w-3 h-3 rounded-sm mt-1.5 mr-2' style=background-color:{=COLOR}></div>
                  <span>{=NAME}</span>
                </div>
                <span class='pl-4'>{=VALUE}</span>
              </li>
            }}
          </ul>`,
      },
    },
    point: {
      focus: {
        only: xAxisSize > 1,
      },
      pattern: [
        'circle',
      ],
      r: 3,
    },
    legend: {
      usePoint: true,
      item: {
        tile: {
          width: 10,
        },
      },
    },
    area: {
      linearGradient: true,
    },
    padding: {
      right: rotateXAxias && 35,
    },
    bindto: '#dataChart',
  }
}

const validTimeBacket = ['hour', 'day', 'week', 'month']
const validPeriods = ['custom', 'today', 'yesterday', '1d', '7d', '4w', '3M', '12M', '24M']
const validFilters = ['cc', 'pg', 'lc', 'ref', 'dv', 'br', 'os', 'so', 'me', 'ca', 'lt', 'ev']

const typeNameMapping = (t: (str: string) => string) => ({
  cc: t('project.mapping.cc'),
  pg: t('project.mapping.pg'),
  lc: t('project.mapping.lc'),
  ref: t('project.mapping.ref'),
  dv: t('project.mapping.dv'),
  br: t('project.mapping.br'),
  os: t('project.mapping.os'),
  so: 'utm_source',
  me: 'utm_medium',
  ca: 'utm_campaign',
  lt: t('project.mapping.lt'),
  ev: t('project.event'),
})

const iconClassName = 'w-6 h-6'
const panelIconMapping = {
  cc: <GlobeEuropeAfricaIcon className={iconClassName} />,
  pg: <DocumentTextIcon className={iconClassName} />,
  lc: <LanguageIcon className={iconClassName} />,
  ref: <ArrowRightCircleIcon className={iconClassName} />,
  dv: <DeviceTabletIcon className={iconClassName} />,
  br: <MagnifyingGlassIcon className={iconClassName} />,
  os: <ServerIcon className={iconClassName} />,
}

// This function return date using the same format as the backend
const getFormatDate = (date: Date) => {
  const yyyy = date.getFullYear()
  let mm: string | number = date.getMonth() + 1
  let dd: string | number = date.getDate()
  if (dd < 10) dd = `0${dd}`
  if (mm < 10) mm = `0${mm}`
  return `${yyyy}-${mm}-${dd}`
}

export {
  iconClassName, getFormatDate, panelIconMapping, typeNameMapping, validFilters,
  validPeriods, validTimeBacket, noRegionPeriods, getSettings,
  getExportFilename, getColumns, onCSVExportClick, CHART_METRICS_MAPPING,
  CHART_METRICS_MAPPING_PERF, getColumnsPerf, getSettingsPerf, transformAIChartData,
}
