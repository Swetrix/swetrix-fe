import React, { useMemo } from 'react'
import { Link } from '@remix-run/react'
import { ClientOnly } from 'remix-utils'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import cx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Loader from 'ui/Loader'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { IError } from '../interfaces/error'

dayjs.extend(timezone)

interface IErrors {
  errors: IError[]
  onClick: (psid: string) => void
  timezone: string
}

interface IErrorItem {
  error: IError
  timezone: string
  onClick: (psid: string) => void
  className?: string
}

const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

// @ts-ignore
const formatTimeAgo = (date, language: string) => {
  const rtf = new Intl.RelativeTimeFormat(language)

  // @ts-ignore
  let duration = (date - new Date()) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      // @ts-ignore
      return rtf.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}

const ErrorItem = ({ error, onClick, className, timezone }: IErrorItem) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')
  const lastSeen = useMemo(() => {
    if (!Intl?.RelativeTimeFormat) {
      return new Date(error.last_seen).toLocaleDateString(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    }

    const date = dayjs.tz(error.last_seen, timezone).toDate()

    return formatTimeAgo(date, language)
  }, [error.last_seen, language, timezone])

  const eidUrl = new URL(window.location.href)
  eidUrl.searchParams.set('eid', error.eid)
  const stringifiedUrl = eidUrl.toString()

  return (
    <Link
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.stopPropagation()
        window.history.pushState({}, '', stringifiedUrl)

        onClick(error.eid)
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
            <p className='font-semibold leading-6 text-gray-900 dark:text-gray-50'>
              <span className='font-bold text-base'>{error.name}</span>
              <span className='text-gray-400 mx-1 text-sm'>|</span>
              <span className='text-gray-500 mx-1 font-normal text-sm'>{error.filename}</span>
            </p>
            <p className='mt-1 flex text-base leading-5 text-gray-500 dark:text-gray-300'>{error.message}</p>
            <p className='mt-1 flex text-base leading-5 text-gray-500 dark:text-gray-300'>{lastSeen}</p>
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-x-4'>
          <div className='hidden sm:flex sm:flex-col sm:items-end'>
            <p className='text-sm leading-6 text-gray-900  dark:text-gray-50'>
              {t('dashboard.xOccurrences', {
                x: error.count,
              })}
            </p>
            {/* {error.active ? (
              <Badge label={t('dashboard.active')} colour='green' />
            ) : (
              <Badge label={t('billing.inactive')} colour='yellow' />
            )} */}
          </div>
          <ChevronRightIcon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
        </div>
      </li>
    </Link>
  )
}

export const Errors: React.FC<IErrors> = ({ errors, onClick, timezone }) => {
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
              key={error.eid}
              error={error}
              timezone={timezone}
              onClick={onClick}
              className={`${index === 0 && 'rounded-t-md'} ${index === errors.length - 1 && 'rounded-b-md'}`}
            />
          ))}
        </ul>
      )}
    </ClientOnly>
  )
}
