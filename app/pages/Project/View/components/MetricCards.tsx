import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'
import _sum from 'lodash/sum'
import _round from 'lodash/round'
import _isNumber from 'lodash/isNumber'
import { nFormatter } from 'utils/generic'
import { IOverallObject } from 'redux/models/IProject'
import { Badge } from 'ui/Badge'

interface IMetricCard {
  label: string
  value: string | number
  change?: number
  type?: 'percent' | 'string'
}

const MetricCard: React.FC<IMetricCard> = ({ label, value, change, type }) => (
  <div className='flex flex-col'>
    <div className='font-bold text-4xl whitespace-nowrap text-slate-900 dark:text-gray-50'>
      {value}
    </div>
    <div
      className={cx('flex items-center font-bold whitespace-nowrap text-sm', {
        'space-x-2': _isNumber(change),
      })}
    >
      <span className='text-slate-900 dark:text-gray-50'>
        {label}
      </span>
      {_isNumber(change) && change < 0 && (
        <Badge
          colour='red'
          label={`${change}${type === 'percent' ? '%' : ''}`}
        />
      )}
      {_isNumber(change) && change > 0 && (
        <Badge
          colour='green'
          label={`${change}${type === 'percent' ? '%' : ''}`}
        />
      )}
      {change === 0 && (
        <Badge
          colour='slate'
          label={`0${type === 'percent' ? '%' : ''}`}
        />
      )}
    </div>
  </div>
)

interface IMetricCards {
  overall: IOverallObject
}

const MetricCards = ({
  overall, chartData, activePeriod, live, sessionDurationAVG, projectId,
  sessionDurationAVGCompare, isActiveCompare, dataChartCompare, activeDropdownLabelCompare, projectPassword,
}: IMetricCards) => {
  const { t } = useTranslation('common')

  const pageViewsCompare = _sum(dataChartCompare?.visits) || 0
  const uniquesCompare = _sum(dataChartCompare?.uniques) || 0
  let bounceRateCompare = 0

  if (pageViewsCompare > 0) {
    bounceRateCompare = _round((uniquesCompare * 100) / pageViewsCompare, 1)
  }

  return (
    <div className='flex space-x-5 mb-5'>
      <MetricCard
        label={t('dashboard.unique')}
        value={nFormatter(overall.current.unique, 1)}
        change={overall.percChangeUnique}
        type='percent'
      />
      <MetricCard
        label={t('dashboard.pageviews')}
        value={nFormatter(overall.current.all, 1)}
        change={overall.percChange}
        type='percent'
      />
      <MetricCard
        label={t('dashboard.bounceRate')}
        value={`${overall.current.bounceRate || 0}%`}
        change={isActiveCompare && _round(bounceRateCompare - (overall.current.bounceRate || 0), 1)}
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
