import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { TFunction } from 'i18next'
import _map from 'lodash/map'

import Modal from 'ui/Modal'
import { Badge } from 'ui/Badge'

interface IViewProjectHotkeys {
  onClose: () => void
  isOpened: boolean
}

interface IHotkeysList {
  title: string
  hotkeys: { [key: string]: string }
}

const getHotkeys = (t: TFunction) => ({
  [t('modals.shortcuts.timebuckets')]: {
    [t('project.thisHour')]: 'H',
    [t('project.today')]: 'T',
    [t('project.yesterday')]: 'Y',
    [t('project.last24h')]: 'D',
    [t('project.lastXDays', { amount: 7 })]: 'W',
    [t('project.lastXWeeks', { amount: 4 })]: 'M',
    [t('project.lastXMonths', { amount: 3 })]: 'Q',
    [t('project.lastXMonths', { amount: 12 })]: 'Y',
    [t('project.lastXMonths', { amount: 24 })]: 'Z',
    [t('project.all')]: 'A',
    [t('project.compare')]: 'C',
    [t('project.custom')]: 'U',
  },
  [t('modals.shortcuts.tabs')]: {
    [t('dashboard.traffic')]: 'Shift + T',
    [t('dashboard.performance')]: 'Shift + P',
    [t('dashboard.sessions')]: 'Shift + S',
    [t('dashboard.funnels')]: 'Shift + F',
    [t('dashboard.alerts')]: 'Shift + A',
    [t('common.settings')]: 'Shift + E',
  },
  [t('common.general')]: {
    [t('modals.forecast.title')]: 'Alt + F',
    [t('project.search')]: 'Alt + S',
    [t('project.barChart')]: 'Alt + B',
    [t('project.lineChart')]: 'Alt + L',
  },
})

const HotkeysList = ({ title, hotkeys }: IHotkeysList) => (
  <div>
    <table className='min-w-full divide-y divide-gray-300 dark:divide-gray-700'>
      <thead>
        <th className='font-semibold text-base text-gray-900 dark:text-gray-50 pb-2'>{title}</th>
        <th />
      </thead>
      <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
        {_map(hotkeys, (action, label) => (
          <tr key={label}>
            <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-50 sm:pl-0'>
              {label}
            </td>
            <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-50 sm:pl-0'>
              <Badge colour='slate' label={action} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const ViewProjectHotkeys = ({ onClose, isOpened }: IViewProjectHotkeys): JSX.Element => {
  const { t } = useTranslation('common')
  const hotkeys = useMemo(() => getHotkeys(t), [t])

  return (
    <Modal
      onClose={onClose}
      closeText={t('common.cancel')}
      message={
        <div className='mt-5 grid gap-5 grid-cols-1 md:grid-cols-2'>
          {_map(hotkeys, (_hotkeys, title) => (
            <HotkeysList title={title} hotkeys={_hotkeys} />
          ))}
        </div>
      }
      title={t('modals.shortcuts.title')}
      isOpened={isOpened}
      size='large'
    />
  )
}

ViewProjectHotkeys.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
}

export default ViewProjectHotkeys
