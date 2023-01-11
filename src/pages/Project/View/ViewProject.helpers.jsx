import { saveAs } from 'file-saver'
import {
  GlobeEuropeAfricaIcon, LanguageIcon, DocumentTextIcon, DeviceTabletIcon,
  ArrowRightCircleIcon, MagnifyingGlassIcon, ServerIcon,
} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
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
import _includes from 'lodash/includes'
import JSZip from 'jszip'

import { getTimeFromSeconds, getStringFromTime, sumArrays } from 'utils/generic'
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
  sessionDuration: 'sessionDuration',
}

const CHART_METRICS_MAPPING_PERF = {
  full: 'full',
  timing: 'timing',
  network: 'network',
  frontend: 'frontend',
  backend: 'backend',
}

// setting the default values for the time period dropdown
const noRegionPeriods = ['custom', 'yesterday']

const getSettings = (timeBucket, theme, activeChartMetrics, isPerf) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
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
        stacked: isPerf,
      },
      y1: {
        display: activeChartMetrics.bounce || activeChartMetrics.sessionDuration,
        position: 'right',
        min: activeChartMetrics.bounce ? 0 : null,
        max: activeChartMetrics.bounce ? 100 : null,
        default: activeChartMetrics.bounce ? [0, 100] : null,
        grid: {
          drawOnChartArea: false,
          color: theme === 'dark' ? '#2a3638' : '#CCDCE666',
        },
        ticks: {
          callback: activeChartMetrics.bounce ? (d) => `${d}%` : (d) => getStringFromTime(getTimeFromSeconds(d)),
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        onHover: (evt, item, legend) => {
          const { chart } = legend
          const { datasets } = chart.data
          const { text } = item

          chart.canvas.style.cursor = 'pointer'

          const datasetsUpdate = _map(datasets, (dataset) => {
            if (dataset.label === text) {
              return {
                ...dataset,
                borderWidth: 4,
              }
            }

            return dataset
          })
          chart.data.datasets = datasetsUpdate
          chart.update('none')
        },
        onLeave: (evt, item, legend) => {
          const { chart } = legend
          const { datasets } = chart.data
          const { text } = item

          chart.canvas.style.cursor = 'default'

          const datasetsUpdate = _map(datasets, (dataset) => {
            if (dataset.label === text) {
              return {
                ...dataset,
                borderWidth: 1,
              }
            }
            return dataset
          })
          chart.data.datasets = datasetsUpdate
          chart.update('none')
        },
        onClick: () => {},
        labels: {
          color: theme === 'dark' ? '#c0d6d9' : '#1e2a2f',
          font: { weight: 500, size: 12, family: "'Inter', 'Cantarell', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'" },
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(255 255 255)',
        titleFont: {
          family: "'Inter', 'Cantarell', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'",
          size: 16,
          weight: 800,
        },
        padding: {
          top: 5,
          bottom: 5,
          left: 8,
          right: 8,
        },
        titleColor: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)',
        titleSpacing: 4,
        bodyColor: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(0 0 0)',
        bodyFont: {
          family: "'Inter', 'Cantarell', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'",
          size: 15,
          weight: 500,
        },
        bodySpacing: 4,
        cornerRadius: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            if (_includes(context.dataset?._satype, 'trendline')) return null

            if (_includes(context.dataset?._satype, 'bounce')) {
              // eslint-disable-next-line consistent-return
              return `${context.dataset.label} ${context.formattedValue}%`
            }

            if (_includes(context.dataset?._satype, 'sessionDuration')) {
              // eslint-disable-next-line consistent-return
              return `${context.dataset.label} ${getStringFromTime(getTimeFromSeconds(context.formattedValue))}`
            }

            if (_includes(context.dataset?._satype, 'timmings')) {
              // eslint-disable-next-line consistent-return
              return `${context.dataset.label} ${getStringFromTime(getTimeFromSeconds(context.formattedValue), true)}`
            }

            return `${context.dataset.label} ${context.formattedValue}`
          },
          title: (context) => {
            if (timeBucket === 'hour') return dayjs(context[0].parsed.x).format('D MMM h:mm')
            if (timeBucket === 'day') return dayjs(context[0].parsed.x).format('D MMM')
            if (timeBucket === 'week') return dayjs(context[0].parsed.x).format('D MMM')
            if (timeBucket === 'month') return dayjs(context[0].parsed.x).format('D MMM YYYY')
            return dayjs(context[0].label).format('MMM D, YYYY')
          },
          labelColor: (context) => {
            return {
              backgroundColor: context.dataset.borderColor,
            }
          },
        },
      },
    },
  }
}

const getColumns = (chart, activeChartMetrics, applyRegions, t) => {
  const {
    views, bounce, viewsPerUnique, unique, trendlines, sessionDuration,
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
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      data: chart.uniques,
      segment: {
        // eslint-disable-next-line consistent-return
        borderDash: (context) => {
          if (context.p1DataIndex === chart.uniques.length - 1 && applyRegions) return [5, 5]
        },
      },
    })
    if (trendlines) {
      columns.push({
        type: 'line',
        _satype: 'trendline',
        label: t('project.trendlineUnique'),
        borderColor: '#436abf',
        pointBackgroundColor: '#436abf',
        pointRadius: 0,
        pointStyle: 'rectRounded',
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
      pointStyle: 'rectRounded',
      backgroundColor: 'rgba(217, 119, 6, 0.2)',
      pointBorderWidth: 0,
      borderWidth: 2,
      fill: true,
      data: chart.visits,
      segment: {
        // eslint-disable-next-line consistent-return
        borderDash: (context) => {
          if (context.p1DataIndex === chart.visits.length - 1 && applyRegions) return [5, 5]
        },
      },
    })
    if (trendlines) {
      columns.push({
        type: 'line',
        _satype: 'trendline',
        label: t('project.trendlineTotal'),
        borderColor: '#eba14b',
        pointBackgroundColor: '#eba14b',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 0,
        pointStyle: 'rectRounded',
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
        _satype: 'bounce',
        label: `${t('dashboard.bounceRate')} (%)`,
        borderColor: '#2AC4B3',
        pointBackgroundColor: '#2AC4B3',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 0,
        pointStyle: 'rectRounded',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
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
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: false,
      data: viewsPerUniqueArray,
    })
  }

  if (sessionDuration) {
    columns.push({
      type: 'line',
      _satype: 'sessionDuration',
      label: t('dashboard.sessionDuration'),
      pointBorderWidth: 0,
      pointBackgroundColor: '#F87171',
      pointRadius: 0,
      pointHoverRadius: 4,
      borderColor: '#F87171',
      pointStyle: 'rectRounded',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      yAxisID: 'y1',
      data: chart.sdur,
    })
  }

  return { labels, columns }
}

const getColumnsPerf = (chart, activeChartMetrics, t) => {
  const labels = [..._map(chart.x, el => dayjs(el).toDate())]

  const columns = []

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.full) {
    columns.push({
      type: 'line',
      label: t('dashboard.dns'),
      _satype: 'timmings',
      borderColor: '#EC4319',
      pointBackgroundColor: '#EC4319',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      borderWidth: 2,
      tension: 0.4,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(236, 67, 25, 0.2)',
      data: chart.dns,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.tls'),
      _satype: 'timmings',
      borderColor: '#F27059',
      pointBackgroundColor: '#F27059',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      borderWidth: 2,
      tension: 0.4,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(242, 112, 89, 0.2)',
      data: chart.tls,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.conn'),
      _satype: 'timmings',
      borderColor: '#F7A265',
      pointBackgroundColor: '#F7A265',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(247, 162, 101, 0.2)',
      data: chart.conn,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.response'),
      _satype: 'timmings',
      borderColor: '#F5D376',
      pointBackgroundColor: '#F5D376',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(245, 211, 118, 0.2)',
      data: chart.response,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.render'),
      _satype: 'timmings',
      borderColor: '#709775',
      pointBackgroundColor: '#709775',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(112, 151, 117, 0.2)',
      data: chart.render,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.domLoad'),
      _satype: 'timmings',
      borderColor: '#A5E6AB',
      pointBackgroundColor: '#A5E6AB',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(165, 230, 171, 0.2)',
      data: chart.domLoad,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.ttfb'),
      _satype: 'timmings',
      borderColor: '#00A8E8',
      pointBackgroundColor: '#00A8E8',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(0, 168, 232, 0.2)',
      data: chart.ttfb,
    })
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.timing) {
    columns.push({
      type: 'line',
      label: t('dashboard.frontend'),
      _satype: 'timmings',
      borderColor: '#709775',
      pointBackgroundColor: '#709775',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(112, 151, 117, 0.2)',
      data: sumArrays(chart.render, chart.domLoad),
    })
    columns.push({
      type: 'line',
      label: t('dashboard.network'),
      _satype: 'timmings',
      borderColor: '#F7A265',
      pointBackgroundColor: '#F7A265',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(247, 162, 101, 0.2)',
      data: sumArrays(chart.dns, chart.tls, chart.conn, chart.response),
    })
    columns.push({
      type: 'line',
      label: t('dashboard.backend'),
      _satype: 'timmings',
      borderColor: '#00A8E8',
      tension: 0.4,
      pointBackgroundColor: '#00A8E8',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(0, 168, 232, 0.2)',
      data: chart.ttfb,
    })
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.network) {
    columns.push({
      type: 'line',
      label: t('dashboard.dns'),
      _satype: 'timmings',
      borderColor: '#EC4319',
      pointBackgroundColor: '#EC4319',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(236, 67, 25, 0.2)',
      data: chart.dns,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.tls'),
      _satype: 'timmings',
      borderColor: '#F27059',
      pointBackgroundColor: '#F27059',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(242, 112, 89, 0.2)',
      data: chart.tls,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.conn'),
      _satype: 'timmings',
      borderColor: '#F7A265',
      pointBackgroundColor: '#F7A265',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(247, 162, 101, 0.2)',
      data: chart.conn,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.response'),
      _satype: 'timmings',
      borderColor: '#F5D376',
      pointBackgroundColor: '#F5D376',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      tension: 0.4,
      borderWidth: 2,
      pointStyle: 'rectRounded',
      fill: true,
      backgroundColor: 'rgba(245, 211, 118, 0.2)',
      data: chart.response,
    })
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.frontend) {
    columns.push({
      type: 'line',
      label: t('dashboard.render'),
      _satype: 'timmings',
      borderColor: '#709775',
      pointBackgroundColor: '#709775',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(112, 151, 117, 0.2)',
      data: chart.render,
    })
    columns.push({
      type: 'line',
      label: t('dashboard.domLoad'),
      _satype: 'timmings',
      borderColor: '#A5E6AB',
      pointBackgroundColor: '#A5E6AB',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(165, 230, 171, 0.2)',
      data: chart.domLoad,
    })
  }

  if (activeChartMetrics === CHART_METRICS_MAPPING_PERF.backend) {
    columns.push({
      type: 'line',
      label: t('dashboard.ttfb'),
      _satype: 'timmings',
      borderColor: '#00A8E8',
      pointBackgroundColor: '#00A8E8',
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 0,
      pointStyle: 'rectRounded',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(0, 168, 232, 0.2)',
      data: chart.ttfb,
    })
  }

  return { labels, columns }
}

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
  iconClassName, getFormatDate, panelIconMapping, typeNameMapping, validFilters, validPeriods, validTimeBacket, paidPeriods, noRegionPeriods, getSettings, getExportFilename, getColumns, onCSVExportClick, CHART_METRICS_MAPPING, CHART_METRICS_MAPPING_PERF, getColumnsPerf,
}
