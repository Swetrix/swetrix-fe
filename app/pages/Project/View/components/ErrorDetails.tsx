import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IErrorDetails } from '../interfaces/error'
import { MetricCard } from './MetricCards'
import { getRelativeDateIfPossible } from 'utils/date'
import Tooltip from 'ui/Tooltip'

interface IErrorDetailsComponent {
  details: IErrorDetails
}

export const ErrorDetails = ({ details }: IErrorDetailsComponent) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')

  const firstSeen = useMemo(() => {
    return getRelativeDateIfPossible(details.first_seen, language)
  }, [details.first_seen, language])

  const lastSeen = useMemo(() => {
    return getRelativeDateIfPossible(details.last_seen, language)
  }, [details.last_seen, language])

  return (
    <div className='flex justify-center lg:justify-start gap-5 mb-5 flex-wrap'>
      <div className='flex flex-col'>
        <p className='font-bold text-4xl text-slate-900 dark:text-gray-50'>{`${details.name}: ${details.message}`}</p>
        <p className='font-medium text-slate-700 dark:text-gray-200'>
          {t('dashboard.atFile', {
            filename: details.filename,
            lineno: details.lineno,
            colno: details.colno,
          })}
        </p>
      </div>

      <MetricCard
        label={t('dashboard.firstSeen')}
        value={details.first_seen || 'N/A'}
        valueMapper={(value) => (
          <Tooltip className='max-w-content !w-full' tooltipNode={<span>{firstSeen}</span>} text={`${value} UTC`} />
        )}
      />

      <MetricCard
        label={t('dashboard.lastSeen')}
        value={details.last_seen || 'N/A'}
        valueMapper={(value) => (
          <Tooltip className='max-w-content !w-full' tooltipNode={<span>{lastSeen}</span>} text={`${value} UTC`} />
        )}
      />
    </div>
  )
}
