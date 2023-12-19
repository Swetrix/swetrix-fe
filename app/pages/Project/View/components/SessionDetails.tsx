import React from 'react'
import { useTranslation } from 'react-i18next'
import _capitalize from 'lodash/capitalize'
import { getStringFromTime, getTimeFromSeconds } from 'utils/generic'
import { ISessionDetails } from '../interfaces/session'
import { MetricCard } from './MetricCards'

interface ISessionDetailsComponent {
  details: ISessionDetails
  psid: string
}

export const SessionDetails = ({ details, psid }: ISessionDetailsComponent) => {
  const { t } = useTranslation('common')

  // TODO: display psid
  return (
    <div className='flex justify-center lg:justify-start gap-5 mb-5 flex-wrap'>
      <MetricCard
        label={t('project.mapping.cc')}
        value={details.cc || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.rg')}
        value={details.rg || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.ct')}
        value={details.ct || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.os')}
        value={details.os || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.dv')}
        value={details.dv || 'N/A'}
        valueMapper={(value) => _capitalize(value)}
      />
      <MetricCard
        label={t('project.mapping.br')}
        value={details.br || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.lc')}
        value={details.lc || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.ref')}
        value={details.ref || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.so')}
        value={details.so || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.me')}
        value={details.me || 'N/A'}
      />
      <MetricCard
        label={t('project.mapping.ca')}
        value={details.ca || 'N/A'}
      />
      <MetricCard
        label={t('dashboard.sessionDuration')}
        value={details.sdur as number}
        valueMapper={(value) => getStringFromTime(getTimeFromSeconds(value))}
      />
    </div>
  )
}
