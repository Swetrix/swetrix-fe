import React, { useMemo } from 'react'
import { Link } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import cx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Loader from 'ui/Loader'
import { IError } from '../interfaces/error'
import { getRelativeDateIfPossible } from 'utils/date'
import { Badge } from 'ui/Badge'

interface IErrors {
  errors: IError[]
  onClick: (psid: string) => void
}

interface IErrorItem {
  error: IError
  onClick: (psid: string) => void
  className?: string
}

const ErrorItem = ({ error, onClick, className }: IErrorItem) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')
  const lastSeen = useMemo(() => {
    return getRelativeDateIfPossible(error.last_seen, language)
  }, [error.last_seen, language])
  const status: {
    label: string
    colour: 'red' | 'yellow' | 'slate'
  } = useMemo(() => {
    if (error.status === 'active') {
      return {
        label: t('error.status.active'),
        colour: 'red',
      }
    }

    if (error.status === 'regressed') {
      return {
        label: t('error.status.regressed'),
        colour: 'yellow',
      }
    }

    return {
      label: t('error.status.resolved'),
      colour: 'slate',
    }
  }, [error.status, t])

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
            <p className='mt-1 flex text-base leading-5 text-gray-500 dark:text-gray-300'>
              <Badge className='sm:hidden mr-2' label={status.label} colour={status.colour} />
              {lastSeen}
              <span className='text-gray-400 mx-1 text-sm sm:hidden'>|</span>
              <span className='sm:hidden'>
                {t('dashboard.xOccurrences', {
                  x: error.count,
                })}
              </span>
            </p>
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-x-4'>
          <div className='hidden sm:flex sm:flex-col sm:items-end'>
            <p className='text-sm leading-6 text-gray-900  dark:text-gray-50'>
              {t('dashboard.xOccurrences', {
                x: error.count,
              })}
            </p>
            <Badge label={status.label} colour={status.colour} />
          </div>
          <ChevronRightIcon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
        </div>
      </li>
    </Link>
  )
}

export const Errors: React.FC<IErrors> = ({ errors, onClick }) => {
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
              onClick={onClick}
              className={`${index === 0 && 'rounded-t-md'} ${index === errors.length - 1 && 'rounded-b-md'}`}
            />
          ))}
        </ul>
      )}
    </ClientOnly>
  )
}
