import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'
import _round from 'lodash/round'
import _isNumber from 'lodash/isNumber'
import { nFormatter, getStringFromTime, getTimeFromSeconds } from 'utils/generic'
import { IOverallObject } from 'redux/models/IProject'
import { Badge } from 'ui/Badge'

interface IMetricCard {
  label: string
  value: string | number | undefined
  goodChangeDirection: 'up' | 'down'
  change?: number
  type?: 'percent' | 'string'
  valueMapper?: (value: any, type: 'main' | 'badge') => any
}

const ChangeBadge = ({
  change, type, goodChangeDirection, valueMapper,
}: Partial<IMetricCard>) => {
  if (!_isNumber(change)) {
    return null
  }

  if (change === 0) {
    const label = valueMapper ? valueMapper(change, 'badge') : `0${type === 'percent' ? '%' : ''}`

    return (
      <Badge
        colour='slate'
        label={label}
      />
    )
  }

  if (change < 0 && goodChangeDirection === 'up') {
    const label = valueMapper ? valueMapper(change, 'badge') : `${change}${type === 'percent' ? '%' : ''}`

    return (
      <Badge
        colour='green'
        label={label}
      />
    )
  }

  if (change < 0 && goodChangeDirection === 'down') {
    const label = valueMapper ? valueMapper(change, 'badge') : `${change}${type === 'percent' ? '%' : ''}`

    return (
      <Badge
        colour='red'
        label={label}
      />
    )
  }

  if (change > 0 && goodChangeDirection === 'up') {
    const label = valueMapper ? valueMapper(change, 'badge') : `${change}${type === 'percent' ? '%' : ''}`

    return (
      <Badge
        colour='red'
        label={label}
      />
    )
  }

  if (change > 0 && goodChangeDirection === 'down') {
    const label = valueMapper ? valueMapper(change, 'badge') : `${change}${type === 'percent' ? '%' : ''}`

    return (
      <Badge
        colour='green'
        label={label}
      />
    )
  }
}

const MetricCard: React.FC<IMetricCard> = ({ label, value, change, type, goodChangeDirection, valueMapper }) => (
  <div className='flex flex-col'>
    <div className='font-bold text-4xl whitespace-nowrap text-slate-900 dark:text-gray-50'>
      {valueMapper ? valueMapper(value, 'main') : value}
    </div>
    <div
      className={cx('flex items-center font-bold whitespace-nowrap text-sm', {
        'space-x-2': _isNumber(change),
      })}
    >
      <span className='text-slate-900 dark:text-gray-50'>
        {label}
      </span>
      <ChangeBadge
        change={change}
        type={type}
        goodChangeDirection={goodChangeDirection}
        valueMapper={valueMapper}
      />
    </div>
  </div>
)

interface IMetricCards {
  overall: Partial<IOverallObject>
}

const MetricCards = ({ overall }: IMetricCards) => {
  const { t } = useTranslation('common')

  return (
    <div className='flex justify-center lg:justify-start gap-5 mb-5 flex-wrap'>
      <MetricCard
        label={t('dashboard.unique')}
        value={overall.current?.unique}
        change={overall.uniqueChange}
        type='percent'
        goodChangeDirection='down'
        valueMapper={(value, type) => `${type === 'badge' && value > 0 ? '+' : ''}${nFormatter(value, 1)}`}
      />
      <MetricCard
        label={t('dashboard.pageviews')}
        value={overall.current?.all}
        change={overall.change}
        type='percent'
        goodChangeDirection='down'
        valueMapper={(value, type) => `${type === 'badge' && value > 0 ? '+' : ''}${nFormatter(value, 1)}`}
      />
      <MetricCard
        label={t('dashboard.bounceRate')}
        value={_round(overall.current?.bounceRate as number, 1)}
        change={_round(overall.bounceRateChange as number, 1)}
        type='percent'
        goodChangeDirection='up'
        // valueMapper={(value) => `${value}%`}
      />
      <MetricCard
        label={t('dashboard.sessionDuration')}
        value={overall.current?.sdur}
        change={overall.sdurChange}
        goodChangeDirection='down'
        valueMapper={(value) => getStringFromTime(getTimeFromSeconds(value))}
      />
    </div>
  )
}

export default memo(MetricCards)
