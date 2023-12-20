import React from 'react'
import _map from 'lodash/map'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ISession } from '../interfaces/session'
import { Badge } from 'ui/Badge'
import { useTranslation } from 'react-i18next'
import CCRow from './CCRow'

interface ISessions {
  sessions: ISession[]
  onClick: (psid: string) => void
}

interface ISessionComponent {
  session: ISession
  onClick: (psid: string) => void
}

const Session = ({ session, onClick }: ISessionComponent) => {
  const { t, i18n: { language } } = useTranslation('common')

  return (
    <li
      className='relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer sm:px-6 lg:px-8'
      onClick={() => onClick(session.psid)}
    >
      <div className='flex min-w-0 gap-x-4'>
        <div className='min-w-0 flex-auto'>
          <p className='text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50'>
            {session.psid}
            <span className='text-gray-400 mx-1'>
              |
            </span>
            {session.created}
          </p>
          <p className='mt-1 flex text-xs leading-5 text-gray-500 dark:text-gray-300'>
            {session.cc ? (
              <CCRow size={18} cc={session.cc} language={language} />
            ) : t('project.unknownCountry')}
            <span className='text-gray-400 mx-1'>
              |
            </span>
            {session.os}
            <span className='text-gray-400 mx-1'>
              |
            </span>
            {session.br}
          </p>
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-x-4'>
        <div className='hidden sm:flex sm:flex-col sm:items-end'>
          <p className='text-sm leading-6 text-gray-900  dark:text-gray-50'>
            {`${session.pageviews} pageviews`}
          </p>
          {session.active ? (
            <Badge label={t('dashboard.active')} colour='green' />
          ) : (
            <Badge label={t('billing.inactive')} colour='yellow' />
          )}
        </div>
        <ChevronRightIcon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
      </div>
    </li>
  )
}

export const Sessions: React.FC<ISessions> = ({ sessions, onClick }) => {
  return (
    <ul className='divide-y divide-gray-100 dark:divide-slate-700'>
      {_map(sessions, (session) => (
        <Session key={session.psid} session={session} onClick={onClick} />
      ))}
    </ul>
  )
}
