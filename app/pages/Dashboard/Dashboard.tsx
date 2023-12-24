/* eslint-disable react/forbid-prop-types */
import React, { memo, useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { ClientOnly } from 'remix-utils'
import cx from 'clsx'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _isNumber from 'lodash/isNumber'
import _replace from 'lodash/replace'
import _map from 'lodash/map'
import _isUndefined from 'lodash/isUndefined'
import _filter from 'lodash/filter'
import _find from 'lodash/find'
import { useTranslation } from 'react-i18next'
import {
  FolderPlusIcon,
  AdjustmentsVerticalIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

import Modal from 'ui/Modal'
import Select from 'ui/Select'
import { withAuthentication, auth } from 'hoc/protected'
import Loader from 'ui/Loader'
import { Badge } from 'ui/Badge'
import routes from 'routesPath'
import { nFormatter, calculateRelativePercentage } from 'utils/generic'
import {
  isSelfhosted,
  ENTRIES_PER_PAGE_DASHBOARD,
  tabForOwnedProject,
  tabForSharedProject,
  tabForCaptchaProject,
  DASHBOARD_TABS,
  tabsForDashboard,
  roleViewer,
} from 'redux/constants'
import EventsRunningOutBanner from 'components/EventsRunningOutBanner'
import useDebounce from 'hooks/useDebounce'

import { acceptShareProject } from 'api'

import Pagination from 'ui/Pagination'
import { ISharedProject } from 'redux/models/ISharedProject'
import { IProject, ICaptchaProject, ILiveStats, IOverall } from 'redux/models/IProject'
import { IUser } from 'redux/models/IUser'

interface IProjectCard {
  name?: string
  active?: boolean
  birdseye: IOverall
  type: 'analytics' | 'captcha'
  t: (
    key: string,
    options?: {
      [key: string]: string | number | null | undefined
    },
  ) => string
  live?: string | number
  isPublic?: boolean
  confirmed?: boolean
  id: string
  deleteProjectFailed: (message: string) => void
  sharedProjects: ISharedProject[]
  setProjectsShareData: (data: Partial<ISharedProject>, id: string, shared?: boolean) => void
  setUserShareData: (data: Partial<ISharedProject>, id: string) => void
  shared?: boolean
  userSharedUpdate: (message: string) => void
  sharedProjectError: (message: string) => void
  captcha?: boolean
  isTransferring?: boolean
  getRole?: (id: string) => string | null
  members?: number
}

interface IMiniCard {
  labelTKey: string
  t: (
    key: string,
    options?: {
      [key: string]: string | number | null | undefined
    },
  ) => string
  total?: number | string
  percChange?: number
}

const MiniCard = ({ labelTKey, t, total, percChange }: IMiniCard): JSX.Element => {
  const statsDidGrowUp = percChange ? percChange >= 0 : false

  return (
    <div>
      <p className='text-sm text-gray-500 dark:text-gray-300'>{t(labelTKey)}</p>

      <div className='flex font-bold'>
        <p className='text-xl text-gray-700 dark:text-gray-100'>{_isNumber(total) ? nFormatter(total) : total}</p>
        {_isNumber(percChange) && (
          <p
            className={cx('flex text-xs items-center', {
              'text-green-600': statsDidGrowUp,
              'text-red-600': !statsDidGrowUp,
            })}
          >
            {statsDidGrowUp ? (
              <>
                <ChevronUpIcon className='self-center flex-shrink-0 h-4 w-4 text-green-500' />
                <span className='sr-only'>{t('dashboard.inc')}</span>
              </>
            ) : (
              <>
                <ChevronDownIcon className='self-center flex-shrink-0 h-4 w-4 text-red-500' />
                <span className='sr-only'>{t('dashboard.dec')}</span>
              </>
            )}
            {nFormatter(percChange)}%
          </p>
        )}
      </div>
    </div>
  )
}

MiniCard.defaultProps = {
  total: 0,
  percChange: null,
}

const ProjectCard = ({
  name,
  active,
  birdseye,
  t,
  live,
  isPublic,
  confirmed,
  id,
  deleteProjectFailed,
  sharedProjects,
  setProjectsShareData,
  setUserShareData,
  shared,
  userSharedUpdate,
  sharedProjectError,
  captcha,
  isTransferring,
  type,
  getRole,
  members,
}: IProjectCard): JSX.Element => {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const role = useMemo(() => getRole && getRole(id), [getRole, id])
  const navigate = useNavigate()

  const onAccept = async () => {
    // @ts-ignore
    const pid: string = _find(sharedProjects, (item: ISharedProject) => item.project && item.project.id === id)?.id

    try {
      if (!pid || !id) {
        throw new Error('Project not found')
      }
      await acceptShareProject(pid)
      setProjectsShareData({ confirmed: true }, id, true)
      setUserShareData({ confirmed: true }, pid)
      userSharedUpdate(t('apiNotifications.acceptInvitation'))
    } catch (e) {
      sharedProjectError(t('apiNotifications.acceptInvitationError'))
      // @ts-ignore
      deleteProjectFailed(e)
    }
  }

  const onElementClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (confirmed) {
      return
    }

    e.stopPropagation()
    e.preventDefault()
    setShowInviteModal(true)
  }

  return (
    <div
      onClick={() => {
        navigate(_replace(type === 'analytics' ? routes.project : routes.captcha, ':id', id))
      }}
    >
      <li
        onClick={onElementClick}
        className='overflow-hidden rounded-xl border border-gray-200 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-800/25'
      >
        <div className='py-4 px-4'>
          <div className='flex justify-between items-center'>
            <p className='text-lg font-semibold text-slate-900 dark:text-gray-50 truncate'>{name}</p>

            <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
              {role !== roleViewer.role && (
                <Link
                  to={_replace(type === 'analytics' ? routes.project_settings : routes.captcha_settings, ':id', id)}
                  aria-label={`${t('project.settings.settings')} ${name}`}
                >
                  <AdjustmentsVerticalIcon className='w-6 h-6 text-gray-800 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-500' />
                </Link>
              )}
              <a
                href={_replace(type === 'analytics' ? routes.project : routes.captcha, ':id', id)}
                aria-label='name (opens in a new tab)'
                target='_blank'
                rel='noopener noreferrer'
              >
                <ArrowTopRightOnSquareIcon className='w-6 h-6 text-gray-800 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-500' />
              </a>
            </div>
          </div>
          <div className='mt-1 flex-shrink-0 flex gap-2 flex-wrap'>
            {active ? (
              <Badge colour='green' label={t('dashboard.active')} />
            ) : (
              <Badge colour='red' label={t('dashboard.disabled')} />
            )}
            {shared &&
              (confirmed ? (
                <Badge colour='green' label={t('dashboard.shared')} />
              ) : (
                <Badge colour='yellow' label={t('common.pending')} />
              ))}
            {isTransferring && <Badge colour='indigo' label={t('common.transferring')} />}
            {isPublic && <Badge colour='green' label={t('dashboard.public')} />}
            {_isNumber(members) && (
              <Badge
                colour='slate'
                label={
                  members === 1
                    ? t('common.oneMember')
                    : t('common.xMembers', {
                        number: members,
                      })
                }
              />
            )}
          </div>
          <div className='mt-4 flex-shrink-0 flex gap-5'>
            {birdseye[id] && (
              <MiniCard
                labelTKey={captcha ? 'dashboard.captchaEvents' : 'dashboard.pageviews'}
                t={t}
                total={birdseye[id].current.all}
                percChange={calculateRelativePercentage(birdseye[id].previous.all, birdseye[id].current.all)}
              />
            )}
            {!captcha && <MiniCard labelTKey='dashboard.liveVisitors' t={t} total={live} />}
          </div>
        </div>
        {!confirmed && (
          <Modal
            onClose={() => {
              setShowInviteModal(false)
            }}
            onSubmit={() => {
              setShowInviteModal(false)
              onAccept()
            }}
            submitText={t('common.accept')}
            type='confirmed'
            closeText={t('common.cancel')}
            title={t('dashboard.invitationFor', { project: name })}
            message={t('dashboard.invitationDesc', { project: name })}
            isOpened={showInviteModal}
          />
        )}
      </li>
    </div>
  )
}

ProjectCard.defaultProps = {
  isPublic: false,
  active: false,
  shared: false,
  captcha: false,
  confirmed: false,
  name: '',
  live: 'N/A',
  isTransferring: false,
  getRole: () => '',
}

interface INoProjects {
  t: (key: string) => string
  onClick: () => void
}

const NoProjects = ({ t, onClick }: INoProjects): JSX.Element => (
  <button
    type='button'
    onClick={onClick}
    className='mx-auto relative block max-w-lg rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
  >
    <FolderPlusIcon className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-200' />
    <span className='mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-50'>
      {t('dashboard.createProject')}
    </span>
  </button>
)

const AddProject = ({ t, onClick }: INoProjects): JSX.Element => (
  <li
    onClick={onClick}
    className='flex cursor-pointer justify-center items-center rounded-lg border-2 border-dashed h-auto min-h-[149.1px] lg:min-h-[auto] group border-gray-300 hover:border-gray-400'
  >
    <div>
      <FolderPlusIcon className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-200 group-hover:text-gray-500 group-hover:dark:text-gray-400' />
      <span className='mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-50 group-hover:dark:text-gray-400'>
        {t('dashboard.newProject')}
      </span>
    </div>
  </li>
)

interface DashboardProps {
  projects: IProject[]
  isLoading: boolean
  error: string
  user: IUser
  deleteProjectFailed: (error: string) => void
  setProjectsShareData: (data: Partial<ISharedProject>) => void
  setUserShareData: (data: Partial<ISharedProject>) => void
  userSharedUpdate: (message: string) => void
  sharedProjectError: (error: string) => void
  loadProjects: (take: number, skip: number, search: string) => void
  loadSharedProjects: (take: number, skip: number, search: string) => void
  total: number
  setDashboardPaginationPage: (page: number) => void
  dashboardPaginationPage: number
  sharedProjects: ISharedProject[]
  dashboardTabs: string
  setDashboardTabs: (tab: string) => void
  sharedTotal: number
  setDashboardPaginationPageShared: (page: number) => void
  dashboardPaginationPageShared: number
  captchaProjects: ICaptchaProject[]
  captchaTotal: number
  dashboardPaginationPageCaptcha: number
  setDashboardPaginationPageCaptcha: (page: number) => void
  loadProjectsCaptcha: (take: number, skip: number, search: string) => void
  liveStats: ILiveStats
  birdseye: IOverall
}

const Dashboard = ({
  projects,
  isLoading,
  error,
  user,
  deleteProjectFailed,
  setProjectsShareData,
  setUserShareData,
  userSharedUpdate,
  sharedProjectError,
  loadProjects,
  loadSharedProjects,
  total,
  setDashboardPaginationPage,
  dashboardPaginationPage,
  sharedProjects,
  dashboardTabs,
  setDashboardTabs,
  sharedTotal,
  setDashboardPaginationPageShared,
  dashboardPaginationPageShared,
  captchaProjects,
  captchaTotal,
  dashboardPaginationPageCaptcha,
  setDashboardPaginationPageCaptcha,
  loadProjectsCaptcha,
  liveStats,
  birdseye,
}: DashboardProps): JSX.Element => {
  const {
    t,
  }: {
    t: (
      key: string,
      options?: {
        [key: string]: string | number | null | undefined
      },
    ) => string
  } = useTranslation('common')
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
  const [showActivateEmailModal, setShowActivateEmailModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const [tabProjects, setTabProjects] = useState<string>(dashboardTabs)
  const pageAmountShared: number = Math.ceil(sharedTotal / ENTRIES_PER_PAGE_DASHBOARD)
  const pageAmount: number = Math.ceil(total / ENTRIES_PER_PAGE_DASHBOARD)
  const pageAmountCaptcha: number = Math.ceil(captchaTotal / ENTRIES_PER_PAGE_DASHBOARD)
  const getRole = (pid: string): string | null =>
    _find([..._map(sharedProjects, (item) => ({ ...item.project, role: item.role }))], (p) => p.id === pid)?.role ||
    null
  // This search represents what's inside the search input
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce<string>(search, 500)

  const onNewProject = () => {
    if (user.isActive || isSelfhosted) {
      if (dashboardTabs === tabForCaptchaProject) {
        navigate(routes.new_captcha)
      } else {
        navigate(routes.new_project)
      }
    } else {
      setShowActivateEmailModal(true)
    }
  }

  useEffect(() => {
    if (sharedTotal <= 0 && tabProjects === tabForSharedProject) {
      setDashboardTabs(tabForOwnedProject)
      setTabProjects(tabForOwnedProject)
    }

    setDashboardTabs(tabProjects)
  }, [tabProjects, setDashboardTabs, sharedTotal])

  useEffect(() => {
    setSearch('')
  }, [tabProjects])

  useEffect(() => {
    if (tabProjects === tabForOwnedProject) {
      loadProjects(
        ENTRIES_PER_PAGE_DASHBOARD,
        (dashboardPaginationPage - 1) * ENTRIES_PER_PAGE_DASHBOARD,
        debouncedSearch,
      )
    }
    if (tabProjects === tabForSharedProject) {
      loadSharedProjects(
        ENTRIES_PER_PAGE_DASHBOARD,
        (dashboardPaginationPageShared - 1) * ENTRIES_PER_PAGE_DASHBOARD,
        debouncedSearch,
      )
    }
    if (tabProjects === tabForCaptchaProject) {
      loadProjectsCaptcha(
        ENTRIES_PER_PAGE_DASHBOARD,
        (dashboardPaginationPageCaptcha - 1) * ENTRIES_PER_PAGE_DASHBOARD,
        debouncedSearch,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardPaginationPage, dashboardPaginationPageShared, debouncedSearch])

  const dashboardLocTabs = useMemo(() => {
    if (sharedTotal <= 0) {
      return [
        {
          id: DASHBOARD_TABS.owned,
          name: tabForOwnedProject,
          label: t('profileSettings.owned'),
        },
        {
          id: DASHBOARD_TABS.captcha,
          name: tabForCaptchaProject,
          label: t('profileSettings.captcha'),
        },
      ]
    }

    return [
      {
        id: DASHBOARD_TABS.owned,
        name: tabForOwnedProject,
        label: t('profileSettings.owned'),
      },
      {
        id: DASHBOARD_TABS.shared,
        name: tabForSharedProject,
        label: t('profileSettings.shared'),
      },
      {
        id: DASHBOARD_TABS.captcha,
        name: tabForCaptchaProject,
        label: t('profileSettings.captcha'),
      },
    ]
  }, [t, sharedTotal])

  const activeTabLabel = useMemo(() => {
    return _find(dashboardLocTabs, (tab) => tab.name === tabProjects)?.label
  }, [dashboardLocTabs, tabProjects])

  if (error && !isLoading) {
    return (
      <div className='flex justify-center pt-10'>
        <div className='rounded-md bg-red-50 p-4 w-11/12 lg:w-4/6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>{error}</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <div className='min-h-min-footer bg-gray-50 dark:bg-slate-900'>
        <EventsRunningOutBanner />
        <div className='flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl w-full mx-auto'>
            <div className='flex justify-between mb-6'>
              <div className='flex items-end justify-between'>
                <h2 className='flex items-baseline mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50'>
                  {t('titles.dashboard')}
                  {isSearchActive ? (
                    <XMarkIcon
                      className='ml-2 w-5 h-5 text-gray-900 dark:text-gray-50 cursor-pointer hover:opacity-80'
                      onClick={() => {
                        setSearch('')
                        setIsSearchActive(false)
                      }}
                    />
                  ) : (
                    <MagnifyingGlassIcon
                      className='ml-2 w-5 h-5 text-gray-900 dark:text-gray-50 cursor-pointer hover:opacity-80'
                      onClick={() => {
                        setIsSearchActive(true)
                      }}
                    />
                  )}
                </h2>
                {isSearchActive && (
                  <div className='hidden sm:flex items-center pb-1 w-full max-w-md px-2 sm:ml-5'>
                    <label htmlFor='simple-search' className='sr-only'>
                      Search
                    </label>
                    <div className='relative w-full'>
                      <div className='absolute sm:flex hidden inset-y-0 left-0 items-center pointer-events-none'>
                        <MagnifyingGlassIcon className='ml-2 w-5 h-5 text-gray-900 dark:text-gray-50 cursor-pointer hover:opacity-80' />
                      </div>
                      <input
                        type='text'
                        onChange={onSearch}
                        value={search}
                        className='bg-gray-50 border-none h-7 ring-1 ring-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 block w-full sm:pl-10 p-2.5 dark:bg-slate-900 dark:ring-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-200'
                        placeholder={t('project.search')}
                      />
                    </div>
                  </div>
                )}
              </div>
              <span
                onClick={onNewProject}
                className='!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-slate-900 hover:bg-slate-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm'
              >
                <FolderPlusIcon className='w-5 h-5 mr-1' />
                {tabProjects === tabForCaptchaProject ? t('dashboard.newCaptchaProject') : t('dashboard.newProject')}
              </span>
            </div>
            {isSearchActive && (
              <div className='flex sm:hidden items-center mb-2 w-full'>
                <label htmlFor='simple-search' className='sr-only'>
                  Search
                </label>
                <div className='relative w-full'>
                  <div className='absolute flex inset-y-0 left-0 items-center pointer-events-none'>
                    <MagnifyingGlassIcon className='ml-2 w-5 h-5 text-gray-900 dark:text-gray-50 cursor-pointer hover:opacity-80' />
                  </div>
                  <input
                    type='text'
                    onChange={onSearch}
                    value={search}
                    className='bg-gray-50 border-none h-7 ring-1 ring-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 block w-full pl-10 p-2.5 py-5 dark:bg-slate-900 dark:ring-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-200'
                    placeholder={t('project.search')}
                  />
                </div>
              </div>
            )}
            {!isSelfhosted && (
              <div className='mb-2'>
                {/* Dashboard tabs selector */}
                <div>
                  <div className='sm:hidden mb-2'>
                    <Select
                      items={dashboardLocTabs}
                      keyExtractor={(item) => item.id}
                      labelExtractor={(item) => item.label}
                      onSelect={(label) => {
                        const nameTab = _find(dashboardLocTabs, (tab) => t(tab.label) === label)?.name
                        if (nameTab) {
                          setTabProjects(nameTab)
                        }
                      }}
                      title={activeTabLabel}
                      capitalise
                    />
                  </div>
                  <div className='hidden sm:block'>
                    <nav className='-mb-px flex space-x-8'>
                      {_map(tabsForDashboard, (tab) => {
                        if (tab.name === tabForSharedProject && sharedTotal <= 0) {
                          return null
                        }

                        return (
                          <button
                            key={tab.name}
                            type='button'
                            onClick={() => setTabProjects(tab.name)}
                            className={cx('whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-md', {
                              'border-slate-900 text-slate-900 dark:text-gray-50 dark:border-gray-50':
                                tabProjects === tab.name,
                              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-300':
                                tabProjects !== tab.name,
                            })}
                            aria-current={tab.name === tabProjects ? 'page' : undefined}
                          >
                            {t(tab.label)}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className='min-h-min-footer bg-gray-50 dark:bg-slate-900'>
                <Loader />
              </div>
            ) : (
              <ClientOnly
                fallback={
                  <div className='min-h-min-footer bg-gray-50 dark:bg-slate-900'>
                    <Loader />
                  </div>
                }
              >
                {() => (
                  <>
                    {tabProjects === tabForOwnedProject && (
                      <div>
                        {_isEmpty(_filter(projects, ({ uiHidden }) => !uiHidden)) ? (
                          <NoProjects t={t} onClick={onNewProject} />
                        ) : (
                          <ul className='grid grid-cols-1 gap-x-6 gap-y-3 lg:gap-y-6 lg:grid-cols-3'>
                            {_map(
                              _filter(projects, ({ uiHidden }) => !uiHidden),
                              ({ name, id, active, public: isPublic, isTransferring, share }) => (
                                <ProjectCard
                                  key={id}
                                  members={1 + _size(share)}
                                  id={id}
                                  type='analytics'
                                  t={t}
                                  name={name}
                                  active={active}
                                  isPublic={isPublic}
                                  birdseye={birdseye}
                                  live={_isNumber(liveStats[id]) ? liveStats[id] : 'N/A'}
                                  setUserShareData={() => {}}
                                  deleteProjectFailed={() => {}}
                                  userSharedUpdate={() => {}}
                                  sharedProjects={[]}
                                  setProjectsShareData={() => {}}
                                  sharedProjectError={() => {}}
                                  isTransferring={isTransferring}
                                  confirmed
                                />
                              ),
                            )}
                            <AddProject t={t} onClick={onNewProject} />
                          </ul>
                        )}
                      </div>
                    )}

                    {tabProjects === tabForCaptchaProject && (
                      <div>
                        {_isEmpty(_filter(captchaProjects, ({ uiHidden }) => !uiHidden)) ? (
                          <NoProjects t={t} onClick={onNewProject} />
                        ) : (
                          <ul className='grid grid-cols-1 gap-x-6 gap-y-3 lg:gap-y-6 lg:grid-cols-3'>
                            {_map(
                              _filter(captchaProjects, ({ uiHidden }) => !uiHidden),
                              ({ name, id, active, public: isPublic }) => (
                                <ProjectCard
                                  t={t}
                                  key={id}
                                  id={id}
                                  type='captcha'
                                  name={name}
                                  captcha
                                  active={active}
                                  isPublic={isPublic}
                                  birdseye={birdseye}
                                  live={_isNumber(liveStats[id]) ? liveStats[id] : 'N/A'}
                                  deleteProjectFailed={() => {}}
                                  sharedProjects={[]}
                                  setProjectsShareData={() => {}}
                                  setUserShareData={() => {}}
                                  userSharedUpdate={() => {}}
                                  sharedProjectError={() => {}}
                                  confirmed
                                />
                              ),
                            )}
                            <AddProject t={t} onClick={onNewProject} />
                          </ul>
                        )}
                      </div>
                    )}

                    {tabProjects === tabForSharedProject && (
                      <div>
                        {_isEmpty(_filter(sharedProjects, ({ uiHidden }) => !uiHidden)) ? (
                          <NoProjects t={t} onClick={onNewProject} />
                        ) : (
                          <ul className='grid grid-cols-1 gap-x-6 gap-y-3 lg:gap-y-6 lg:grid-cols-3'>
                            {_map(
                              _filter(sharedProjects, ({ uiHidden }) => !uiHidden),
                              ({ project, confirmed }) => {
                                if (_isUndefined(confirmed) || confirmed) {
                                  return (
                                    <ProjectCard
                                      t={t}
                                      key={`${project?.id}-confirmed`}
                                      type='analytics'
                                      id={project?.id}
                                      name={project?.name}
                                      shared
                                      getRole={getRole}
                                      active={project?.active}
                                      isPublic={project?.public}
                                      confirmed={confirmed}
                                      birdseye={birdseye}
                                      live={_isNumber(liveStats[project.id]) ? liveStats[project.id] : 'N/A'}
                                      setUserShareData={() => {}}
                                      deleteProjectFailed={() => {}}
                                      sharedProjects={[]}
                                      setProjectsShareData={() => {}}
                                      userSharedUpdate={() => {}}
                                      sharedProjectError={() => {}}
                                    />
                                  )
                                }

                                return (
                                  <ProjectCard
                                    t={t}
                                    key={project?.id}
                                    id={project?.id}
                                    type='analytics'
                                    name={project?.name}
                                    shared
                                    getRole={getRole}
                                    active={project?.active}
                                    isPublic={project?.public}
                                    birdseye={birdseye}
                                    confirmed={confirmed}
                                    sharedProjects={user.sharedProjects}
                                    setProjectsShareData={setProjectsShareData}
                                    setUserShareData={setUserShareData}
                                    live={_isNumber(liveStats[project.id]) ? liveStats[project.id] : 'N/A'}
                                    userSharedUpdate={userSharedUpdate}
                                    sharedProjectError={sharedProjectError}
                                    deleteProjectFailed={deleteProjectFailed}
                                  />
                                )
                              },
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ClientOnly>
            )}
            {tabProjects === tabForOwnedProject && pageAmount > 1 && (
              <Pagination
                className='mt-2'
                page={dashboardPaginationPage}
                pageAmount={pageAmount}
                setPage={setDashboardPaginationPage}
                total={total}
              />
            )}
            {tabProjects === tabForSharedProject && pageAmountShared > 1 && (
              <Pagination
                className='mt-2'
                page={dashboardPaginationPageShared}
                pageAmount={pageAmountShared}
                setPage={setDashboardPaginationPageShared}
                total={sharedTotal}
              />
            )}
            {tabProjects === tabForCaptchaProject && pageAmountCaptcha > 1 && (
              <Pagination
                className='mt-2'
                page={dashboardPaginationPageCaptcha}
                pageAmount={pageAmountCaptcha}
                setPage={setDashboardPaginationPageCaptcha}
                total={captchaTotal}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        onClose={() => setShowActivateEmailModal(false)}
        onSubmit={() => setShowActivateEmailModal(false)}
        submitText={t('common.gotIt')}
        title={t('dashboard.verifyEmailTitle')}
        type='info'
        message={t('dashboard.verifyEmailDesc')}
        isOpened={showActivateEmailModal}
      />
    </>
  )
}

Dashboard.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  sharedProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  deleteProjectFailed: PropTypes.func.isRequired,
  setProjectsShareData: PropTypes.func.isRequired,
  setUserShareData: PropTypes.func.isRequired,
  sharedProjectError: PropTypes.func.isRequired,
  userSharedUpdate: PropTypes.func.isRequired,
  loadProjects: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  setDashboardPaginationPage: PropTypes.func.isRequired,
  setDashboardPaginationPageShared: PropTypes.func.isRequired,
  dashboardPaginationPage: PropTypes.number.isRequired,
  dashboardPaginationPageShared: PropTypes.number.isRequired,
  dashboardTabs: PropTypes.string.isRequired,
  setDashboardTabs: PropTypes.func.isRequired,
  sharedTotal: PropTypes.number.isRequired,
  birdseye: PropTypes.object.isRequired,
}

Dashboard.defaultProps = {
  error: '',
}

export default memo(withAuthentication(Dashboard, auth.authenticated))
