import { saveAs } from 'file-saver'
import {
  GlobeEuropeAfricaIcon, LanguageIcon, DocumentTextIcon, DeviceTabletIcon,
  ArrowRightCircleIcon, MagnifyingGlassIcon, ServerIcon,
} from '@heroicons/react/24/outline'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { area, spline } from 'billboard.js'
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
import JSZip from 'jszip'

import { tbsFormatMapper } from 'redux/constants'

import countries from 'utils/isoCountries'

const getAvg = (arr) => {
  const total = _reduce(arr, (acc, c) => acc + c, 0)
  return total / _size(arr)
}

const getSum = (arr) => {
  return _reduce(arr, (acc, c) => acc + c, 0)
}

const trendline = (data) => {
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
      trendData.push(0)
    } else {
      trendData.push(y)
    }
  }

  return trendData
}

const getExportFilename = (prefix) => {
  // turn something like 2022-03-02T19:31:00.100Z into 2022-03-02
  const date = _split(_replace(_split(new Date().toISOString(), '.')[0], /:/g, '-'), 'T')[0]
  return `${prefix}-${date}.zip`
}

const convertToCSV = (array) => {
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

const onCSVExportClick = (data, pid, tnMapping, language) => {
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
}

const getColumnsChartjs = (chart, activeChartMetrics, t) => {
  const {
    views, bounce, viewsPerUnique, unique, trendlines,
  } = activeChartMetrics

  const labels = [..._map(chart.x, el => dayjs(el).toDate())]

  const columns = []
  if (unique) {
    columns.push({
      type: 'line',
      label: t('project.unique'),
      borderColor: '#2563EB',
      pointBackgroundColor: '#2563EB',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      data: chart.uniques,
    })
    if (trendlines) {
      columns.push({
        type: 'line',
        label: t('project.trendlineUnique'),
        borderColor: '#436abf',
        pointBackgroundColor: '#436abf',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 0,
        borderWidth: 2,
        fill: false,
        data: trendline(chart.uniques),
      })
    }
  }

  if (views) {
    columns.push({
      type: 'line',
      label: t('project.total'),
      borderColor: '#D97706',
      pointBackgroundColor: '#D97706',
      pointRadius: 0,
      pointHoverRadius: 4,
      backgroundColor: 'rgba(217, 119, 6, 0.2)',
      pointBorderWidth: 0,
      borderWidth: 2,
      fill: true,
      data: chart.visits,
    })
    if (trendlines) {
      columns.push({
        type: 'line',
        label: t('project.trendlineTotal'),
        borderColor: '#eba14b',
        pointBackgroundColor: '#eba14b',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 0,
        borderWidth: 2,
        fill: false,
        data: trendline(chart.visits),
      })
    }
  }

  if (bounce) {
    const bounceArray = _map(chart.uniques, (el, i) => {
      return _round((el * 100) / chart.visits[i], 1) || 0
    })
    columns.push(
      {
        type: 'line',
        label: `${t('dashboard.bounceRate')} (%)`,
        borderColor: '#2AC4B3',
        pointBackgroundColor: '#2AC4B3',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 0,
        borderWidth: 2,
        fill: false,
        data: bounceArray,
      },
    )
  }

  if (viewsPerUnique) {
    const viewsPerUniqueArray = _map(chart.visits, (el, i) => {
      if (chart.uniques[i] === 0 || chart.uniques[i] === undefined) {
        return 0
      }
      return _round(el / chart.uniques[i], 1)
    })
    columns.push({
      type: 'line',
      label: t('dashboard.viewsPerUnique'),
      pointBorderWidth: 0,
      pointBackgroundColor: '#F87171',
      pointRadius: 0,
      pointHoverRadius: 4,
      borderColor: '#F87171',
      borderWidth: 2,
      fill: false,
      data: viewsPerUniqueArray,
    })
  }

  return { labels, columns }
}

const getSettings = (timeBucket, theme) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        alignToPixels: true,
        type: 'time',
        time: {
          tooltipFormat: 'll',
          minUnit: 'hour',
          unit: timeBucket,
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM D',
            week: 'MMM D',
            month: 'MMM YYYY',
            year: 'YYYY',
          },
        },
        grid: {
          drawOnChartArea: true,
          drawBorder: false,
          color: theme === 'dark' ? '#2a3638' : '#CCDCE666',
        },
      },
      y: {
        display: true,
        suggestedMin: 0,
        min: 0,
        beginAtZero: true,
        grid: {
          drawOnChartArea: true,
          drawBorder: false,
          color: theme === 'dark' ? '#2a3638' : '#CCDCE666',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        titleColor: theme === 'dark' ? '#c0d6d9' : '#1e2a2f',
        bodyColor: theme === 'dark' ? '#c0d6d9' : '#1e2a2f',
        footerColor: theme === 'dark' ? '#c0d6d9' : '#1e2a2f',
        footerFont: { weight: 'normal', style: 'italic' },
        backgroundColor: theme === 'dark' ? '#1e2a2f' : '#fff',
        displayColors: false,
        cornerRadius: 3,
        callbacks: {
          label: (label) => {
            if (label.dataset._satype?.includes('trendline')) return

            // eslint-disable-next-line consistent-return
            return `${label.dataset.label} ${label.formattedValue}`
          },
        },
      },
    },
  }
}

// setting the default values for the time period dropdown
const noRegionPeriods = ['custom', 'yesterday']

const validTimeBacket = ['hour', 'day', 'week', 'month']
const validPeriods = ['custom', 'today', 'yesterday', '1d', '7d', '4w', '3M', '12M', '24M']
const paidPeriods = ['12M', '24M']
const validFilters = ['cc', 'pg', 'lc', 'ref', 'dv', 'br', 'os', 'so', 'me', 'ca', 'lt']

const typeNameMapping = (t) => ({
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
const getFormatDate = (date) => {
  const yyyy = date.getFullYear()
  let mm = date.getMonth() + 1
  let dd = date.getDate()
  if (dd < 10) dd = `0${dd}`
  if (mm < 10) mm = `0${mm}`
  return `${yyyy}-${mm}-${dd}`
}

export {
  iconClassName, getFormatDate, panelIconMapping, typeNameMapping, validFilters, validPeriods, validTimeBacket, paidPeriods, noRegionPeriods, getExportFilename, onCSVExportClick, CHART_METRICS_MAPPING, getColumnsChartjs, getSettings,
}
