/* eslint-disable jsx-a11y/anchor-is-valid, react/no-unstable-nested-components */
import React, {
  memo, Fragment, useRef, useMemo, MutableRefObject,
} from 'react'

import { Link } from '@remix-run/react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Flag from 'react-flagkit'
import i18next from 'i18next'
import {
  Popover, Transition, Menu,
} from '@headlessui/react'
import {
  Bars3Icon, XMarkIcon, ChevronDownIcon, ArrowSmallRightIcon,
} from '@heroicons/react/24/outline'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import _map from 'lodash/map'
import _includes from 'lodash/includes'
import cx from 'clsx'

import routesPath from 'routesPath'
import { authActions } from 'redux/reducers/auth'
import sagaActions from 'redux/sagas/actions'
import UIActions from 'redux/reducers/ui'
import {
  whitelist, languages, languageFlag, isSelfhosted, BLOG_URL,
  DOCS_URL, SUPPORTED_THEMES, isBrowser,
} from 'redux/constants'
import Dropdown from 'ui/Dropdown'
import { IUser } from 'redux/models/IUser'
import { useAppDispatch, StateType } from 'redux/store'

dayjs.extend(utc)
dayjs.extend(duration)

const TRIAL_STATUS_MAPPING = {
  ENDED: 1,
  ENDS_TODAY: 2,
  ENDS_TOMORROW: 3,
  ENDS_IN_X_DAYS: 4,
}

const ThemeMenu = ({
  theme, t, switchTheme,
}: {
  theme: string,
  t: (key: string, options?: {
    [key: string]: string | number | null,
  }) => string,
  switchTheme: (i: string) => void,
}) => (
  <Menu as='div' className='relative ml-3'>
    <div>
      <Menu.Button className='flex justify-center items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'>
        <span className='sr-only'>
          {t('header.switchTheme')}
        </span>
        {theme === 'dark' ? (
          <SunIcon className='h-6 w-6 text-gray-200 hover:text-gray-300 cursor-pointer' aria-hidden='true' />
        ) : (
          <MoonIcon className='h-6 w-6 text-slate-700 hover:text-slate-600 cursor-pointer' aria-hidden='true' />
        )}
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      enter='transition ease-out duration-100'
      enterFrom='transform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='transform opacity-100 scale-100'
      leaveTo='transform opacity-0 scale-95'
    >
      <Menu.Items className='absolute right-0 z-30 mt-2 w-36 min-w-max origin-top-right rounded-md bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none'>
        <Menu.Item>
          {({ active }) => (
            <div
              className={cx('flex w-full font-semibold cursor-pointer px-4 py-2 text-sm text-indigo-600 dark:text-gray-50 hover:bg-gray-100 hover:dark:bg-slate-800', {
                'bg-gray-100 dark:bg-slate-800': active,
              })}
              onClick={() => switchTheme('light')}
            >
              <SunIcon className='h-5 w-5 mr-2 text-indigo-600 dark:text-gray-200' aria-hidden='true' />
              {t('header.light')}
            </div>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <div
              className={cx('flex w-full font-semibold cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-indigo-400 hover:bg-gray-100 hover:dark:bg-slate-800', {
                'bg-gray-100 dark:bg-slate-800': active,
              })}
              onClick={() => switchTheme('dark')}
            >
              <MoonIcon className='h-5 w-5 mr-2 text-gray-200 dark:text-indigo-400' aria-hidden='true' />
              {t('header.dark')}
            </div>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
)

const ProfileMenu = ({
  user, logoutHandler, t, onLanguageChange, language,
}: {
  user: IUser,
  logoutHandler: () => void,
  t: (key: string, options?: {
    [key: string]: string | number | null,
  }) => string,
  onLanguageChange: (l: string) => void,
  language: string,
}) => (
  <Menu as='div' className='relative ml-3'>
    <div>
      <Menu.Button className='flex justify-center items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'>
        <span>
          {t('common.account')}
        </span>
        <ChevronDownIcon className='h-4 w-4 ml-1 stroke-2' aria-hidden='true' />
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      enter='transition ease-out duration-100'
      enterFrom='transform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='transform opacity-100 scale-100'
      leaveTo='transform opacity-0 scale-95'
    >
      <Menu.Items className='absolute right-0 z-30 mt-2 w-60 min-w-max origin-top-right rounded-md bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none'>
        <div className='border-gray-200 dark:border-slate-700/50 border-b-[1px]'>
          <Menu.Item>
            <p className='truncate py-2 px-4' role='none'>
              <span
                className='block text-xs text-gray-500 dark:text-gray-300'
                role='none'
              >
                {t('header.signedInAs')}
              </span>
              <span
                className='mt-0.5 text-sm font-semibold text-gray-700 dark:text-gray-50'
                role='none'
              >
                {user?.email}
              </span>
            </p>
          </Menu.Item>
        </div>

        <div className='border-gray-200 dark:border-slate-700/50 border-b-[1px]'>
          {/* Language selector */}
          <Menu as='div'>
            {({ open }) => (
              <>
                <div>
                  <Menu.Button
                    className='flex justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-50 hover:bg-gray-100 hover:dark:bg-slate-800'
                  >
                    <div className='flex'>
                      <Flag className='rounded-sm mr-1.5' country={languageFlag[language]} size={20} alt='' aria-hidden='true' />
                      {languages[language]}
                    </div>
                    <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5 stroke-2' aria-hidden='true' />
                  </Menu.Button>
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items
                    className='z-50 py-1 origin-top-right absolute right-0 mt-1 w-full min-w-max rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none'
                    static
                  >
                    {_map(whitelist, lng => (
                      <Menu.Item key={lng}>
                        <span
                          className='text-gray-700 dark:text-gray-50 dark:bg-slate-800 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600'
                          role='menuitem'
                          tabIndex={0}
                          onClick={() => onLanguageChange(lng)}
                        >
                          <div className='flex'>
                            <div className='pt-1'>
                              <Flag className='rounded-sm mr-1.5' country={languageFlag[lng]} size={20} alt={languageFlag[lng]} />
                            </div>
                            {languages[lng]}
                          </div>
                        </span>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          <Menu.Item>
            {({ active }) => (
              <Link
                to={routesPath.changelog}
                className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                  'bg-gray-100 dark:bg-slate-800': active,
                })}
              >
                {t('footer.changelog')}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to={routesPath.contact}
                className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                  'bg-gray-100 dark:bg-slate-800': active,
                })}
              >
                {t('footer.support')}
              </Link>
            )}
          </Menu.Item>
          {!isSelfhosted && (
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={routesPath.billing}
                  className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                    'bg-gray-100 dark:bg-slate-800': active,
                  })}
                >
                  {t('common.billing')}
                </Link>
              )}
            </Menu.Item>
          )}
        </div>

        <Menu.Item>
          {({ active }) => (
            <Link
              to={routesPath.user_settings}
              className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                'bg-gray-100 dark:bg-slate-800': active,
              })}
            >
              {t('common.accountSettings')}
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <p
              className={cx('cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                'bg-gray-100 dark:bg-slate-800': active,
              })}
              onClick={logoutHandler}
            >
              {t('common.logout')}
            </p>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
)

const AuthedHeader = ({
  user, switchTheme, theme, onLanguageChange, rawStatus, status, t, language, logoutHandler, colourBackground,
}: {
  user: IUser
  switchTheme: (thm?: string) => void
  theme: string
  onLanguageChange: (lng: string) => void
  rawStatus: string | number
  status: string
  t: (key: string, options?: {
    [key: string]: string | number | null
  }) => string
  language: string
  logoutHandler: () => void
  colourBackground: boolean
}): JSX.Element => (
  <header
    className={cx('relative overflow-x-clip', {
      'bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-600/40': colourBackground,
    })}
  >
    <nav className='mx-auto px-4 sm:px-6 lg:px-8' aria-label='Top'>
      <div className='w-full py-4 flex items-center justify-between border-b border-indigo-500 dark:border-slate-600 lg:border-none'>
        <div className='flex items-center'>
          {/* Logo */}
          <Link to={routesPath.main}>
            <span className='sr-only'>Swetrix</span>
            <img
              className='h-7 -translate-y-[3px]'
              height='28'
              src={theme === 'dark' ? '/assets/logo_white.png' : '/assets/logo_blue.png'}
              alt='Swetrix'
            />
          </Link>

          <div className='hidden ml-10 space-x-1 lg:flex gap-4'>
            {user?.planCode === 'trial' && (
              <Link
                to={routesPath.billing}
                className={cx('font-semibold leading-6 text-base', {
                  'text-amber-600 hover:text-amber-500': rawStatus === TRIAL_STATUS_MAPPING.ENDS_IN_X_DAYS,
                  'text-rose-600 hover:text-rose-500': rawStatus === TRIAL_STATUS_MAPPING.ENDS_TODAY || rawStatus === TRIAL_STATUS_MAPPING.ENDS_TOMORROW || rawStatus === TRIAL_STATUS_MAPPING.ENDED,
                })}
                key='TrialNotification'
              >
                {status}
              </Link>
            )}
            {user?.planCode === 'none' && (
              <Link
                to={routesPath.billing}
                className='font-semibold leading-6 text-base text-rose-600 hover:text-rose-500'
                key='NoSubscription'
              >
                {t('billing.inactive')}
              </Link>
            )}
            <a
              href={BLOG_URL}
              className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
              target='_blank'
              rel='noreferrer noopener'
            >
              {t('footer.blog')}
            </a>
            <a
              href={DOCS_URL}
              className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
              target='_blank'
              rel='noreferrer noopener'
            >
              {t('common.docs')}
            </a>
            <Link
              to={routesPath.dashboard}
              className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
            >
              {t('common.dashboard')}
            </Link>
          </div>
        </div>
        <div className='hidden md:flex justify-center items-center flex-wrap ml-1 md:ml-10 space-y-1 sm:space-y-0 space-x-2 md:space-x-4'>
          <ThemeMenu
            theme={theme}
            switchTheme={switchTheme}
            t={t}
          />
          <ProfileMenu
            user={user}
            logoutHandler={logoutHandler}
            onLanguageChange={onLanguageChange}
            language={language}
            t={t}
          />
        </div>
        <div className='md:hidden flex justify-center items-center'>
          {/* Theme switch */}
          {theme === 'dark' ? (
            <div className='transition-all duration-1000 ease-in-out rotate-180'>
              <SunIcon onClick={() => switchTheme()} className='h-10 w-10 text-gray-200 hover:text-gray-300 cursor-pointer' />
            </div>
          ) : (
            <div className='transition-all duration-1000 ease-in-out'>
              <MoonIcon onClick={() => switchTheme()} className='h-10 w-10 text-slate-700 hover:text-slate-600 cursor-pointer' />
            </div>
          )}
          <Popover.Button className='bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 rounded-md p-2 ml-3 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
            <span className='sr-only'>
              {t('common.openMenu')}
            </span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </Popover.Button>
        </div>
      </div>
      <div className='py-4 flex gap-4 flex-wrap justify-center space-x-2 lg:hidden'>
        <a
          href={BLOG_URL}
          className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t('footer.blog')}
        </a>
        <a
          href={DOCS_URL}
          className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t('common.docs')}
        </a>
        <Link
          to={routesPath.dashboard}
          className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
        >
          {t('common.dashboard')}
        </Link>
      </div>
    </nav>
  </header>
)

const NotAuthedHeader = ({
  switchTheme, theme, onLanguageChange, t, language, colourBackground, refPage,
}: {
  switchTheme: (a?: string) => void,
  theme: string,
  onLanguageChange: (lang: string) => void,
  t: (key: string) => string,
  language: string,
  colourBackground: boolean,
  refPage?: boolean,
}) => (
  <header
    className={cx('relative overflow-x-clip', {
      'bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-600/40': colourBackground,
    })}
  >
    <nav className='mx-auto px-4 sm:px-6 lg:px-8' aria-label='Top'>
      <div className='w-full py-4 flex items-center justify-between border-b border-indigo-500 dark:border-slate-600 lg:border-none'>
        <div className='flex items-center'>
          {/* Logo */}
          {refPage ? (
            <span>
              <span className='sr-only'>Swetrix</span>
              <img
                className='h-7 -translate-y-[3px]'
                height='28'
                src={theme === 'dark' ? '/assets/logo_white.png' : '/assets/logo_blue.png'}
                alt='Swetrix'
              />
            </span>
          ) : (
            <Link to={routesPath.main}>
              <span className='sr-only'>Swetrix</span>
              <img
                className='h-7 -translate-y-[3px]'
                height='28'
                src={theme === 'dark' ? '/assets/logo_white.png' : '/assets/logo_blue.png'}
                alt='Swetrix'
              />
            </Link>
          )}

          {!refPage && (
            <div className='hidden ml-10 space-x-1 lg:flex gap-4 items-center'>
              <a
                href={BLOG_URL}
                className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
                target='_blank'
                rel='noreferrer noopener'
              >
                {t('footer.blog')}
              </a>
              {!isSelfhosted && (
                <>
                  <Link
                    to={routesPath.features}
                    className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
                  >
                    {t('common.features')}
                  </Link>
                  <Link
                    to={`${routesPath.main}#pricing`}
                    className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
                    key='Pricing'
                  >
                    {t('common.pricing')}
                  </Link>
                </>
              )}
              <a href={DOCS_URL} className='font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white' target='_blank' rel='noreferrer noopener'>
                {/* <DocumentTextIcon className='w-5 h-5 mr-1' /> */}
                {t('common.docs')}
              </a>
            </div>
          )}
        </div>
        <div className='hidden md:flex justify-center items-center flex-wrap ml-1 md:ml-10 space-y-1 sm:space-y-0 space-x-2 md:space-x-4'>
          {/* Language selector */}
          <Dropdown
            items={whitelist}
            buttonClassName='inline-flex items-center [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mr-0 [&>svg]:ml-1 text-sm font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
            selectItemClassName='text-gray-700 block px-4 py-2 text-base cursor-pointer hover:bg-gray-200 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'
            title={(
              <>
                <Flag className='rounded-sm mr-1.5' country={languageFlag[language]} size={18} alt='' aria-hidden='true' />
                {languages[language]}
              </>
            )}
            labelExtractor={(lng: string) => (
              <div className='flex'>
                <div className='pt-1'>
                  <Flag className='rounded-sm mr-1.5' country={languageFlag[lng]} size={21} alt={languageFlag[lng]} />
                </div>
                {languages[lng]}
              </div>
            )}
            onSelect={onLanguageChange}
          />
          <ThemeMenu
            theme={theme}
            switchTheme={switchTheme}
            t={t}
          />
          {!refPage && (
            <>
              <span className='text-slate-700'>
                |
              </span>
              <Link to={routesPath.signin} className='flex items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'>
                {t('auth.common.signin')}
                <ArrowSmallRightIcon className='ml-1 stroke-2 h-4 w-4 mt-[1px]' />
              </Link>
            </>
          )}
        </div>
        <div className='md:hidden flex justify-center items-center'>
          {/* Theme switch */}
          {theme === 'dark' ? (
            <div className='transition-all duration-1000 ease-in-out rotate-180'>
              <SunIcon onClick={() => switchTheme()} className='h-10 w-10 text-gray-200 hover:text-gray-300 cursor-pointer' />
            </div>
          ) : (
            <div className='transition-all duration-1000 ease-in-out'>
              <MoonIcon onClick={() => switchTheme()} className='h-10 w-10 text-slate-700 hover:text-slate-600 cursor-pointer' />
            </div>
          )}
          <Popover.Button className='bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 rounded-md p-2 ml-3 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
            <span className='sr-only'>
              {t('common.openMenu')}
            </span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </Popover.Button>
        </div>
      </div>
      {!refPage && (
        <div className='py-4 flex gap-4 flex-wrap justify-center space-x-2 lg:hidden'>
          <a
            href={BLOG_URL}
            className='flex items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
            target='_blank'
            rel='noreferrer noopener'
          >
            {t('footer.blog')}
          </a>
          <Link
            to={`${routesPath.main}#pricing`}
            className='flex items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
            key='Pricing'
          >
            {t('common.pricing')}
          </Link>
          <Link
            to={routesPath.features}
            className='flex items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
          >
            {t('common.features')}
          </Link>
          <a
            href={DOCS_URL}
            className='flex items-center font-semibold leading-6 text-base text-slate-800 hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
            target='_blank'
            rel='noreferrer noopener'
          >
            {t('common.docs')}
          </a>
        </div>
      )}
    </nav>
  </header>
)

interface IHeader {
  ssrTheme: 'dark' | 'light'
  authenticated: boolean
  refPage?: boolean
  transparent?: boolean
}

const Header: React.FC<IHeader> = ({ ssrTheme, authenticated, refPage, transparent }): JSX.Element => {
  const { t, i18n: { language } }: {
    t: (key: string, options?: {
      [key: string]: string | number | null
    }) => string,
    i18n: { language: string },
  } = useTranslation('common')
  const dispatch = useAppDispatch()
  const _dispatch = useDispatch()
  const { user } = useSelector((state: StateType) => state.auth)
  const reduxTheme = useSelector((state: StateType) => state.ui.theme.theme)
  // @ts-ignore
  const buttonRef: MutableRefObject<HTMLButtonElement> = useRef<HTMLButtonElement>()
  const theme = isBrowser ? reduxTheme : ssrTheme

  const [rawStatus, status] = useMemo(() => {
    const { trialEndDate } = (user || {})

    if (!trialEndDate) {
      return [null, null]
    }

    const now = dayjs.utc()
    const future = dayjs.utc(trialEndDate)
    const diff = future.diff(now)

    if (diff < 0) {
      // trial has already ended
      return [TRIAL_STATUS_MAPPING.ENDED, t('pricing.trialEnded')]
    }

    if (diff < dayjs.duration(1, 'day').asMilliseconds()) {
      // trial ends today or tomorrow
      const isToday = future.isSame(now, 'day')
      const isTomorrow = future.isSame(now.add(1, 'day'), 'day')

      if (isToday) {
        return [TRIAL_STATUS_MAPPING.ENDS_TODAY, t('pricing.trialEndsToday')]
      }
      if (isTomorrow) {
        return [TRIAL_STATUS_MAPPING.ENDS_TOMORROW, t('pricing.trialEndsTomorrow')]
      }
    }

    // trial ends in more than 1 day
    const amount = Math.round(dayjs.duration(diff).asDays())
    return [TRIAL_STATUS_MAPPING.ENDS_IN_X_DAYS, t('pricing.xTrialDaysLeft', { amount })]
  }, [user, t])

  const logoutHandler = () => {
    dispatch(authActions.logout())
    _dispatch(sagaActions.logout(false, false))
  }

  const switchTheme = (_theme?: string) => {
    const newTheme = (_includes(SUPPORTED_THEMES, _theme) && _theme) || (theme === 'dark' ? 'light' : 'dark')
    dispatch(UIActions.setTheme(newTheme as 'light' | 'dark'))
  }

  const onLanguageChange = (id: string) => {
    i18next.changeLanguage(id)
  }

  return (
    <Popover className='relative'>
      {/* Computer / Laptop / Tablet layout header */}
      {authenticated ? (
        <AuthedHeader
          user={user}
          rawStatus={rawStatus || ''}
          status={status || ''}
          logoutHandler={logoutHandler}
          switchTheme={switchTheme}
          theme={theme}
          onLanguageChange={onLanguageChange}
          language={language}
          colourBackground={!transparent}
          t={t}
        />
      ) : (
        <NotAuthedHeader
          switchTheme={switchTheme}
          theme={theme}
          onLanguageChange={onLanguageChange}
          language={language}
          colourBackground={!transparent}
          refPage={refPage}
          t={t}
        />
      )}

      {/* Mobile header popup */}
      <Transition
        as={Fragment}
        enter='duration-200 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel focus className='absolute top-0 z-50 inset-x-0 p-2 transition transform origin-top-right md:hidden'>
          <div className='rounded-lg shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-gray-750 divide-y-2 divide-gray-50 dark:divide-gray-800'>
            <div className='pt-5 pb-6 px-5'>
              <div className='flex items-center justify-between'>
                <Link to={routesPath.main}>
                  <span className='sr-only'>Swetrix</span>
                  <img
                    className='h-7'
                    height='28'
                    src={theme === 'dark' ? '/assets/logo_white.png' : '/assets/logo_blue.png'}
                    alt='Swetrix'
                  />
                </Link>
                <Popover.Button ref={buttonRef} className='bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                  <span className='sr-only'>
                    {t('common.closeMenu')}
                  </span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>
            </div>
            <div className='py-6 px-5 space-y-6'>
              <div className='grid grid-cols-1 gap-y-4'>
                {/* Language selector */}
                <Dropdown
                  items={whitelist}
                  buttonClassName='flex items-center w-full rounded-md border border-gray-300 shadow-sm px-3 md:px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                  selectItemClassName='text-gray-700 block px-4 py-2 text-base cursor-pointer hover:bg-gray-200 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'
                  title={(
                    <>
                      <Flag className='rounded-sm mr-1.5' country={languageFlag[language]} size={21} alt='' aria-hidden='true' />
                      {languages[language]}
                    </>
                  )}
                  labelExtractor={(lng: string) => (
                    <div className='flex'>
                      <div className='pt-1'>
                        <Flag className='rounded-sm mr-1.5' country={languageFlag[lng]} size={21} alt={languageFlag[lng]} />
                      </div>
                      {languages[lng]}
                    </div>
                  )}
                  onSelect={onLanguageChange}
                />
                {authenticated ? (
                  <>
                    {user?.planCode === 'trial' && (
                      <Link
                        to={routesPath.billing}
                        className={cx('font-semibold leading-6 text-base', {
                          'text-amber-600 hover:text-amber-500': rawStatus === TRIAL_STATUS_MAPPING.ENDS_IN_X_DAYS,
                          'text-rose-600 hover:text-rose-500': rawStatus === TRIAL_STATUS_MAPPING.ENDS_TODAY || rawStatus === TRIAL_STATUS_MAPPING.ENDS_TOMORROW || rawStatus === TRIAL_STATUS_MAPPING.ENDED,
                        })}
                        key='TrialNotification'
                      >
                        {status}
                      </Link>
                    )}
                    {user?.planCode === 'none' && (
                      <Link
                        to={routesPath.billing}
                        className='font-semibold leading-6 text-base text-rose-600 hover:text-rose-500'
                        key='NoSubscription'
                      >
                        {t('billing.inactive')}
                      </Link>
                    )}
                    {/* Temporarily put it here until the header is fully redesigned */}
                    {!isSelfhosted && user?.planCode !== 'none' && user?.planCode !== 'trial' && (
                      <Link
                        to={routesPath.billing}
                        className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'
                        key='Billing'
                      >
                        {t('common.billing')}
                      </Link>
                    )}
                    <div onClick={() => buttonRef.current?.click()}>
                      <Link to={routesPath.user_settings} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'>
                        {t('common.accountSettings')}
                      </Link>
                    </div>
                    <div onClick={() => buttonRef.current?.click()}>
                      <Link to='#' className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-gray-50 hover:bg-indigo-50 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700' onClick={logoutHandler}>
                        {t('common.logout')}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={() => buttonRef.current?.click()}>
                      <Link to={routesPath.signin} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-gray-50 hover:bg-indigo-50'>
                        {t('auth.common.signin')}
                      </Link>
                    </div>
                    <div onClick={() => buttonRef.current?.click()}>
                      <Link to={routesPath.signup} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700' aria-label={t('titles.signup')}>
                        {t('common.getStarted')}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default memo(Header)
