import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'
import _sum from 'lodash/sum'
import _round from 'lodash/round'
import { nFormatter } from 'utils/generic'

interface IMetricCard {
  label: string
  value: string | number
  change?: number
  type?: 'percent' | 'string'
}

const MetricCard: React.FC<IMetricCard> = ({ label, value, change, type }) => {
  let _value = value

  if (type === 'percent') {
    _value = `${value}%`
  }

  return (
    <div className='flex flex-col'>
      <div className='font-bold text-4xl whitespace-nowrap'>
        {_value}
      </div>
      <div
        className={cx('flex items-center font-bold whitespace-nowrap text-sm', {
          'space-x-2': change,
        })}
      >
        <span>
          {label}
        </span>
        {change && (
          <span>
            {change}{type === 'percent' ? '%' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

const MetricCards = ({
  overall, chartData, activePeriod, live, sessionDurationAVG, projectId,
  sessionDurationAVGCompare, isActiveCompare, dataChartCompare, activeDropdownLabelCompare, projectPassword,
}) => {
  const { t } = useTranslation('common')

  const pageviewsDidGrowUp = overall.percChange >= 0
  const uniqueDidGrowUp = overall.percChangeUnique >= 0
  const pageviews = _sum(chartData?.visits) || 0
  const pageViewsCompare = _sum(dataChartCompare?.visits) || 0
  const uniques = _sum(chartData?.uniques) || 0
  const uniquesCompare = _sum(dataChartCompare?.uniques) || 0
  let bounceRate = 0
  let bounceRateCompare = 0

  if (pageviews > 0) {
    bounceRate = _round((uniques * 100) / pageviews, 1)
  }

  if (pageViewsCompare > 0) {
    bounceRateCompare = _round((uniquesCompare * 100) / pageViewsCompare, 1)
  }

  return (
    <div className='flex space-x-5'>
      <MetricCard
        label={t('dashboard.unique')}
        value={nFormatter(uniques, 1)}
        change={isActiveCompare && nFormatter(uniquesCompare - uniques, 1)}
      />
      <MetricCard
        label={t('dashboard.pageviews')}
        value={nFormatter(pageviews, 1)}
        change={isActiveCompare && nFormatter(pageViewsCompare - pageviews, 1)}
      />
      <MetricCard
        label={t('dashboard.bounceRate')}
        value={bounceRate}
        change={isActiveCompare && _round(bounceRateCompare - bounceRate, 1)}
        type='percent'
      />
      <MetricCard
        label={t('dashboard.sessionDuration')}
        value={sessionDurationAVG}
        change={isActiveCompare && sessionDurationAVGCompare}
      />
    </div>
  )
}

export default memo(MetricCards)
