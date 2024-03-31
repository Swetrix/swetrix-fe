import React from 'react'
import { Link } from '@remix-run/react'
import { ClientOnly } from 'remix-utils'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import cx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Loader from 'ui/Loader'
import { ISession } from '../interfaces/session'
import { Badge } from 'ui/Badge'
import CCRow from './CCRow'

interface ISessions {
  sessions: ISession[]
  onClick: (psid: string) => void
}

interface ISessionComponent {
  session: ISession
  onClick: (psid: string) => void
  className?: string
}

const ErrorItem = ({ error, onClick, className }: ISessionComponent) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')

  return <div>{JSON.stringify(error)}</div>

  const date = new Date(error.created).toLocaleDateString(language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  const psidUrl = new URL(window.location.href)
  psidUrl.searchParams.set('psid', error.psid)
  const stringifiedUrl = psidUrl.toString()

  return (
    <Link
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.stopPropagation()
        window.history.pushState({}, '', stringifiedUrl)

        onClick(error.psid)
      }}
      to={stringifiedUrl}
    >
      <li
        className={cx(
          'relative flex justify-between gap-x-6 py-5 bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer px-4 sm:px-6 lg:px-8',
          className,
        )}
      >
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50'>
              {error.psid}
              <span className='text-gray-400 mx-1'>|</span>
              {date}
            </p>
            <p className='mt-1 flex text-xs leading-5 text-gray-500 dark:text-gray-300'>
              {error.cc ? <CCRow size={18} cc={error.cc} language={language} /> : t('project.unknownCountry')}
              <span className='text-gray-400 mx-1'>|</span>
              {error.os}
              <span className='text-gray-400 mx-1'>|</span>
              {error.br}
            </p>
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-x-4'>
          <div className='hidden sm:flex sm:flex-col sm:items-end'>
            <p className='text-sm leading-6 text-gray-900  dark:text-gray-50'>{`${error.pageviews} pageviews`}</p>
            {error.active ? (
              <Badge label={t('dashboard.active')} colour='green' />
            ) : (
              <Badge label={t('billing.inactive')} colour='yellow' />
            )}
          </div>
          <ChevronRightIcon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
        </div>
      </li>
    </Link>
  )
}

export const Errors: React.FC<ISessions> = ({ errors, onClick }) => {
  return (
    <ClientOnly
      fallback={
        <div className='bg-gray-50 dark:bg-slate-900'>
          <Loader />
        </div>
      }
    >
      {() => (
        <ul className='divide-y divide-gray-100 dark:divide-slate-700 mt-2'>
          {_map(errors, (error, index) => (
            <ErrorItem
              key={error.name}
              error={error}
              onClick={onClick}
              className={`${index === 0 && 'rounded-t-md'} ${index === errors.length - 1 && 'rounded-b-md'}`}
            />
          ))}
        </ul>
      )}
    </ClientOnly>
  )
}
