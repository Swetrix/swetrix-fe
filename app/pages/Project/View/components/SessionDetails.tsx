import React from 'react'
import { useTranslation } from 'react-i18next'
import _capitalize from 'lodash/capitalize'
import _size from 'lodash/size'
import _truncate from 'lodash/truncate'
import { getLocaleDisplayName, getStringFromTime, getTimeFromSeconds } from 'utils/generic'
import { ISessionDetails } from '../interfaces/session'
import { MetricCard, MetricCardSelect } from './MetricCards'
import CCRow from './CCRow'

interface ISessionDetailsComponent {
  details: ISessionDetails
}

export const SessionDetails = ({ details }: ISessionDetailsComponent) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')

  const geo = [
    {
      label: t('project.mapping.cc'),
      value: details.cc,
    },
    {
      label: t('project.mapping.rg'),
      value: details.rg,
    },
    {
      label: t('project.mapping.ct'),
      value: details.ct,
    },
  ]

  const utm = [
    {
      label: t('project.mapping.so'),
      value: details.so || 'N/A',
    },
    {
      label: t('project.mapping.me'),
      value: details.me || 'N/A',
    },
    {
      label: t('project.mapping.ca'),
      value: details.ca || 'N/A',
    },
  ]

  return (
    <div className='mb-5 flex flex-wrap justify-center gap-5 lg:justify-start'>
      <MetricCardSelect
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        values={geo}
        selectLabel={t('project.geo')}
        valueMapper={({ value }, index) => {
          if (index !== 0) {
            return value || 'N/A'
          }

          if (!value) {
            return t('project.unknownCountry')
          }

          return (
            <div className='flex items-center'>
              <CCRow spaces={1} size={26} cc={value} language={language} />
            </div>
          )
        }}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('project.mapping.os')}
        value={details.os || 'N/A'}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('project.mapping.dv')}
        value={details.dv || 'N/A'}
        valueMapper={(value) => _capitalize(value)}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('project.mapping.br')}
        value={details.br || 'N/A'}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('project.mapping.lc')}
        value={details.lc || 'N/A'}
        valueMapper={(value) => {
          if (value === 'N/A') {
            return value
          }

          return getLocaleDisplayName(value, language)
        }}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('project.mapping.ref')}
        value={details.ref || 'N/A'}
        valueMapper={(value) => {
          if (_size(value) < 20) {
            return value
          }

          return (
            <span title={value}>
              {_truncate(value, {
                length: 20,
              })}
            </span>
          )
        }}
      />
      <MetricCardSelect
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        values={utm}
        selectLabel={t('project.campaigns')}
      />
      <MetricCard
        classes={{
          value: 'max-md:text-xl md:text-3xl',
        }}
        label={t('dashboard.sessionDuration')}
        value={details.sdur as number}
        valueMapper={(value) => getStringFromTime(getTimeFromSeconds(value))}
      />
    </div>
  )
}
