import React, { useState, useEffect, useMemo, memo } from 'react'
import type i18next from 'i18next'
import { useNavigate, useParams } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _replace from 'lodash/replace'
import _find from 'lodash/find'
import _join from 'lodash/join'
import _isString from 'lodash/isString'
import _split from 'lodash/split'
import _keys from 'lodash/keys'
import _filter from 'lodash/filter'
import _map from 'lodash/map'
import _toUpper from 'lodash/toUpper'
import _includes from 'lodash/includes'
import { ExclamationTriangleIcon, TrashIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

import { withAuthentication, auth } from 'hoc/protected'
import { isSelfhosted, TITLE_SUFFIX, ENTRIES_PER_PAGE_DASHBOARD, FILTERS_PANELS_ORDER } from 'redux/constants'
import { IProject } from 'redux/models/IProject'
import { IUser } from 'redux/models/IUser'
import { IProjectForShared, ISharedProject } from 'redux/models/ISharedProject'
import {
  updateProject,
  deleteProject,
  resetProject,
  transferProject,
  deletePartially,
  getFilters,
  resetFilters,
} from 'api'
import Input from 'ui/Input'
import Button from 'ui/Button'
import Loader from 'ui/Loader'
import Checkbox from 'ui/Checkbox'
import Modal from 'ui/Modal'
import FlatPicker from 'ui/Flatpicker'
import countries from 'utils/isoCountries'
import routes from 'routesPath'
import Dropdown from 'ui/Dropdown'
import MultiSelect from 'ui/MultiSelect'
import CCRow from '../View/components/CCRow'
import { getFormatDate } from '../View/ViewProject.helpers'

import People from './People'
import Emails from './Emails'

const MAX_NAME_LENGTH = 50
const MAX_ORIGINS_LENGTH = 300
const MAX_IPBLACKLIST_LENGTH = 300

const tabDeleteDataModal = [
  {
    name: 'all',
    title: 'project.settings.reseted.all',
  },
  {
    name: 'partially',
    title: 'project.settings.reseted.partially',
  },
  {
    name: 'viaFilters',
    title: 'project.settings.reseted.viaFilters',
  },
]

interface IModalMessage {
  dateRange: Date[]
  setDateRange: (a: Date[]) => void
  setTab: (i: string) => void
  t: typeof i18next.t
  tab: string
  pid: string
  activeFilter: string[]
  setActiveFilter: any
  filterType: string
  setFilterType: (a: string) => void
  language: string
}

const ModalMessage = ({
  dateRange,
  setDateRange,
  setTab,
  t,
  tab,
  pid,
  activeFilter,
  setActiveFilter,
  filterType,
  setFilterType,
  language,
}: IModalMessage): JSX.Element => {
  const [filterList, setFilterList] = useState<string[]>([])
  const [searchList, setSearchList] = useState<string[]>([])

  const getFiltersList = async () => {
    if (!_isEmpty(filterType)) {
      const res = await getFilters(pid, filterType)
      setFilterList(res)
      setSearchList(res)
      if (!_isEmpty(activeFilter)) {
        setActiveFilter([])
      }
    }
  }

  useEffect(() => {
    getFiltersList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType])

  return (
    <>
      <p className='mb-4 mt-1 text-sm italic text-gray-500 dark:text-gray-300'>{t('project.settings.resetHint')}</p>
      <div className='mt-6'>
        <nav className='-mb-px flex space-x-6'>
          {_map(tabDeleteDataModal, (tabDelete) => (
            <button
              key={tabDelete.name}
              type='button'
              onClick={() => setTab(tabDelete.name)}
              className={cx('text-md whitespace-nowrap border-b-2 px-1 pb-2 font-medium', {
                'border-indigo-500 text-indigo-600 dark:border-gray-50 dark:text-gray-50': tabDelete.name === tab,
                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300':
                  tab !== tabDelete.name,
              })}
            >
              {t(tabDelete.title)}
            </button>
          ))}
        </nav>
      </div>
      {tab === tabDeleteDataModal[1].name && (
        <>
          <p className='mb-2 mt-4 text-sm text-gray-500 dark:text-gray-300'>
            {t('project.settings.reseted.partiallyDesc')}
          </p>
          <p className='mb-2 mt-1 text-sm italic text-gray-500 dark:text-gray-300'>
            {t('project.settings.reseted.partiallyHint')}
          </p>
          <input
            type='text'
            className='m-0 h-0 w-0 border-0 p-0 focus:border-transparent focus:text-transparent focus:shadow-none focus:ring-transparent'
          />
          <FlatPicker
            onChange={(date) => setDateRange(date)}
            options={{
              altInputClass:
                'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:text-gray-50 dark:placeholder-gray-400 dark:border-gray-800 dark:bg-slate-800 rounded-md',
            }}
            value={dateRange}
          />
        </>
      )}
      {tab === tabDeleteDataModal[0].name && (
        <p className='mb-4 mt-4 text-sm italic text-gray-500 dark:text-gray-300'>
          {t('project.settings.reseted.allHint')}
        </p>
      )}
      {tab === tabDeleteDataModal[2].name && (
        <div className='min-h-[410px]'>
          <p className='mb-4 mt-4 text-sm italic text-gray-500 dark:text-gray-300'>
            {t('project.settings.reseted.viaFiltersHint')}
          </p>
          <div>
            <Dropdown
              className='min-w-[160px]'
              title={
                !_isEmpty(filterType) ? t(`project.mapping.${filterType}`) : t('project.settings.reseted.selectFilters')
              }
              items={FILTERS_PANELS_ORDER}
              labelExtractor={(item) => t(`project.mapping.${item}`)}
              keyExtractor={(item) => item}
              onSelect={(item) => setFilterType(item)}
            />
            <div className='h-2' />
            {filterType && !_isEmpty(filterList) ? (
              <MultiSelect
                className='max-w-max'
                items={searchList}
                // eslint-disable-next-line react/no-unstable-nested-components
                labelExtractor={(item) => {
                  if (filterType === 'cc') {
                    return <CCRow cc={item} language={language} />
                  }

                  return item
                }}
                // eslint-disable-next-line react/no-unstable-nested-components
                itemExtractor={(item) => {
                  if (filterType === 'cc') {
                    return <CCRow cc={item} language={language} />
                  }

                  return item
                }}
                keyExtractor={(item) => item}
                label={activeFilter}
                searchPlaseholder={t('project.search')}
                onSearch={(search: string) => {
                  if (search.length > 0) {
                    if (filterType === 'cc') {
                      setSearchList(
                        _filter(filterList, (item) =>
                          _includes(_toUpper(countries.getName(item, language)), _toUpper(search)),
                        ),
                      )
                      return
                    }

                    setSearchList(_filter(filterList, (item) => _includes(_toUpper(item), _toUpper(search))))
                  } else {
                    setSearchList(filterList)
                  }
                }}
                placholder={t('project.settings.reseted.filtersPlaceholder')}
                onSelect={(item: string) =>
                  setActiveFilter((oldItems: string[]) => {
                    if (_includes(oldItems, item)) {
                      return _filter(oldItems, (i) => i !== item)
                    }
                    return [...oldItems, item]
                  })
                }
                onRemove={(item: string) =>
                  setActiveFilter((oldItems: string[]) => _filter(oldItems, (i) => i !== item))
                }
              />
            ) : (
              <p className='mb-4 mt-4 text-sm italic text-gray-500 dark:text-gray-300'>
                {t('project.settings.reseted.noFilters')}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

interface IForm extends Partial<IProject> {
  origins: string | null
  ipBlacklist: string | null
}

const DEFAULT_PROJECT_NAME = 'Untitled Project'

interface IProjectSettings {
  updateProjectFailed: (message: string) => void
  generateAlerts: (message: string) => void
  projectDeleted: (message: string) => void
  deleteProjectFailed: (message: string) => void
  loadProjects: (shared: boolean, skip: number) => void
  isLoading: boolean
  isLoadingShared: boolean
  projects: IProject[]
  showError: (message: string) => void
  removeProject: (pid: string, shared: boolean) => void
  user: IUser
  isSharedProject: boolean
  sharedProjects: ISharedProject[]
  deleteProjectCache: (pid: string) => void
  setProjectProtectedPassword: (pid: string, password: string) => void
  dashboardPaginationPage: number
  dashboardPaginationPageShared: number
  authLoading: boolean
}

const ProjectSettings = ({
  updateProjectFailed,
  generateAlerts,
  projectDeleted,
  deleteProjectFailed,
  loadProjects,
  isLoading,
  isLoadingShared,
  projects,
  showError,
  removeProject,
  user,
  isSharedProject,
  sharedProjects,
  deleteProjectCache,
  setProjectProtectedPassword,
  dashboardPaginationPage,
  dashboardPaginationPageShared,
  authLoading,
}: IProjectSettings) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')
  // @ts-ignore
  const {
    id,
  }: {
    id: string
  } = useParams()
  const project: IProjectForShared = useMemo(
    () =>
      _find([...projects, ..._map(sharedProjects, (item) => item.project)], (p) => p.id === id) ||
      ({} as IProjectForShared),
    [projects, id, sharedProjects],
  )
  const navigate = useNavigate()

  const [form, setForm] = useState<IForm>({
    name: '',
    id,
    public: false,
    isPasswordProtected: false,
    origins: null,
    ipBlacklist: null,
  })
  const [validated, setValidated] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    name?: string
    origins?: string
    ipBlacklist?: string
    password?: string
  }>({})
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [showReset, setShowReset] = useState<boolean>(false)
  const [projectDeleting, setProjectDeleting] = useState<boolean>(false)
  const [projectResetting, setProjectResetting] = useState<boolean>(false)
  const [projectSaving, setProjectSaving] = useState<boolean>(false)
  const [showTransfer, setShowTransfer] = useState<boolean>(false)
  const [transferEmail, setTransferEmail] = useState<string>('')
  const [dateRange, setDateRange] = useState<Date[]>([])
  const [tab, setTab] = useState<string>(tabDeleteDataModal[0].name)
  const [showProtected, setShowProtected] = useState<boolean>(false)
  const [initialised, setInitialised] = useState(false)

  // for reset data via filters
  const [activeFilter, setActiveFilter] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('')

  const paginationSkip: number = isSharedProject
    ? dashboardPaginationPageShared * ENTRIES_PER_PAGE_DASHBOARD
    : dashboardPaginationPage * ENTRIES_PER_PAGE_DASHBOARD

  useEffect(() => {
    if (authLoading || initialised) {
      return
    }

    if (!user.isActive && !isSelfhosted) {
      showError(t('project.settings.verify'))
      navigate(routes.dashboard)
    }

    if (!isLoading && !isLoadingShared && !projectDeleting) {
      if (_isEmpty(project) || project?.uiHidden) {
        showError(t('project.noExist'))
        navigate(routes.dashboard)
      } else {
        setForm({
          ...project,
          ipBlacklist: _isString(project.ipBlacklist) ? project.ipBlacklist : _join(project.ipBlacklist, ', '),
          origins: _isString(project.origins) ? project.origins : _join(project.origins, ', '),
        })
        setInitialised(true)
      }
    }
  }, [user, project, initialised, isLoading, navigate, showError, projectDeleting, t, authLoading, isLoadingShared])

  const onSubmit = async (data: IForm) => {
    if (!projectSaving) {
      setProjectSaving(true)
      try {
        const formalisedData = {
          ...data,
          origins: _isEmpty(data.origins)
            ? null
            : _map(_split(data.origins, ','), (origin) => {
                try {
                  if (_includes(origin, 'localhost')) {
                    return origin
                  }
                  return new URL(origin).host
                } catch (e) {
                  return origin
                }
              }),
          ipBlacklist: _isEmpty(data.ipBlacklist) ? null : _split(data.ipBlacklist, ','),
        }
        await updateProject(id, formalisedData as Partial<IProject>)
        generateAlerts(t('project.settings.updated'))

        loadProjects(isSharedProject, paginationSkip)
      } catch (reason) {
        updateProjectFailed(reason as string)
      } finally {
        setProjectSaving(false)
      }
    }
  }

  const onDelete = async () => {
    setShowDelete(false)
    if (!projectDeleting) {
      setProjectDeleting(true)
      try {
        await deleteProject(id)
        removeProject(id, isSharedProject)
        projectDeleted(t('project.settings.deleted'))
        navigate(routes.dashboard)
      } catch (e) {
        deleteProjectFailed(e as string)
      } finally {
        setProjectDeleting(false)
      }
    }
  }

  const onReset = async () => {
    setShowReset(false)
    if (!projectResetting) {
      setProjectResetting(true)
      try {
        if (tab === tabDeleteDataModal[1].name) {
          if (_isEmpty(dateRange)) {
            deleteProjectFailed(t('project.settings.noDateRange'))
            setProjectResetting(false)
            return
          }
          await deletePartially(id, {
            from: getFormatDate(dateRange[0]),
            to: getFormatDate(dateRange[1]),
          })
        } else if (tab === tabDeleteDataModal[2].name) {
          if (_isEmpty(activeFilter)) {
            deleteProjectFailed(t('project.settings.noFilters'))
            setProjectResetting(false)
            return
          }

          await resetFilters(id, filterType, activeFilter)
        } else {
          await resetProject(id)
        }
        deleteProjectCache(id)
        projectDeleted(t('project.settings.resetted'))
        navigate(routes.dashboard)
      } catch (e) {
        deleteProjectFailed(e as string)
      } finally {
        setProjectResetting(false)
      }
    }
  }

  const validate = () => {
    const allErrors: {
      name?: string
      origins?: string
      ipBlacklist?: string
      password?: string
    } = {}

    if (_isEmpty(form.name)) {
      allErrors.name = t('project.settings.noNameError')
    }

    if (_size(form.name) > MAX_NAME_LENGTH) {
      allErrors.name = t('project.settings.pxCharsError', { amount: MAX_NAME_LENGTH })
    }

    if (_size(form.origins) > MAX_ORIGINS_LENGTH) {
      allErrors.origins = t('project.settings.oxCharsError', { amount: MAX_ORIGINS_LENGTH })
    }

    if (_size(form.ipBlacklist) > MAX_IPBLACKLIST_LENGTH) {
      allErrors.ipBlacklist = t('project.settings.oxCharsError', { amount: MAX_IPBLACKLIST_LENGTH })
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    validate()
  }, [form]) // eslint-disable-line

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value

    setForm((oldForm) => ({
      ...oldForm,
      [target.name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setBeenSubmitted(true)

    if (validated) {
      onSubmit(form)
    }
  }

  const onCancel = () => {
    navigate(_replace(routes.project, ':id', id))
  }

  const onTransfer = async () => {
    await transferProject(id, transferEmail)
      .then(() => {
        generateAlerts(t('apiNotifications.transferRequestSent'))
        navigate(routes.dashboard)
      })
      .catch((e) => {
        showError(e as string)
      })
      .finally(() => {
        setShowTransfer(false)
        setTransferEmail('')
      })
  }

  const onProtected = async () => {
    setBeenSubmitted(true)

    if (validated) {
      await onSubmit({
        ...form,
        isPasswordProtected: true,
      })

      if (!_isEmpty(form.password) && !_isEmpty(form.id)) {
        setProjectProtectedPassword(form?.id || '', form?.password || '')
      }

      setForm((prev) => ({
        ...prev,
        isPasswordProtected: true,
      }))

      setShowProtected(false)
    }
  }

  const title = `${t('project.settings.settings')} ${form.name}`

  useEffect(() => {
    document.title = `${t('project.settings.settings')} ${form.name} ${TITLE_SUFFIX}`
  }, [form, t])

  if (authLoading || !initialised) {
    return (
      <div className='flex min-h-min-footer flex-col bg-gray-50 px-4 py-6 dark:bg-slate-900 sm:px-6 lg:px-8'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='flex min-h-min-footer flex-col bg-gray-50 px-4 py-6 pb-40 dark:bg-slate-900 sm:px-6 lg:px-8'>
      <form className='mx-auto w-full max-w-7xl' onSubmit={handleSubmit}>
        <h2 className='mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50'>{title}</h2>
        <h3 className='mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>{t('profileSettings.general')}</h3>
        <Input
          name='name'
          label={t('project.settings.name')}
          value={form.name}
          placeholder='My awesome project'
          className='mt-4'
          onChange={handleInput}
          error={beenSubmitted ? errors.name : null}
        />
        <Input
          name='id'
          label={t('project.settings.pid')}
          value={form.id}
          className='mt-4'
          onChange={handleInput}
          error={null}
          disabled
        />
        <Input
          name='sharableLink'
          label={t('project.settings.sharableLink')}
          hint={t('project.settings.sharableDesc')}
          value={`https://swetrix.com/projects/${form.id}`}
          className='mt-4'
          onChange={handleInput}
          error={null}
          disabled
        />
        <Input
          name='origins'
          label={t('project.settings.origins')}
          hint={t('project.settings.originsHint')}
          value={form.origins || ''}
          className='mt-4'
          onChange={handleInput}
          error={beenSubmitted ? errors.origins : null}
        />
        <Input
          name='ipBlacklist'
          label={t('project.settings.ipBlacklist')}
          hint={t('project.settings.ipBlacklistHint')}
          value={form.ipBlacklist || ''}
          className='mt-4'
          onChange={handleInput}
          error={beenSubmitted ? errors.ipBlacklist : null}
        />
        <Checkbox
          checked={Boolean(form.active)}
          onChange={(checked) =>
            setForm((prev) => ({
              ...prev,
              active: checked,
            }))
          }
          name='active'
          className='mt-4'
          label={t('project.settings.enabled')}
          hint={t('project.settings.enabledHint')}
        />
        <Checkbox
          checked={Boolean(form.public)}
          onChange={(checked) => {
            if (!form.isPasswordProtected) {
              setForm((prev) => ({
                ...prev,
                public: checked,
              }))
            }
          }}
          name='public'
          className='mt-4'
          label={t('project.settings.public')}
          hint={t('project.settings.publicHint')}
        />
        <Checkbox
          checked={Boolean(form.isPasswordProtected)}
          onChange={() => {
            if (!form.public && form.isPasswordProtected) {
              setForm({
                ...form,
                isPasswordProtected: false,
              })
              return
            }

            if (!form.public) {
              setShowProtected(true)
            }
          }}
          name='isPasswordProtected'
          className='mt-4'
          label={t('project.settings.protected')}
          hint={t('project.settings.protectedHint')}
        />
        <div className='mt-8 flex flex-wrap justify-center gap-2 sm:justify-between'>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              className='border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800 dark:text-gray-50 dark:hover:bg-slate-700'
              onClick={onCancel}
              secondary
              regular
            >
              {t('common.cancel')}
            </Button>
            <Button type='submit' loading={projectSaving} primary regular>
              {t('common.save')}
            </Button>
          </div>
          {!project?.shared && (
            <div className='flex flex-wrap justify-center gap-2'>
              {!isSelfhosted && (
                <Button onClick={() => setShowTransfer(true)} semiDanger semiSmall>
                  <>
                    <RocketLaunchIcon className='mr-1 h-5 w-5' />
                    {t('project.settings.transfer')}
                  </>
                </Button>
              )}
              <Button
                onClick={() => !projectResetting && setShowReset(true)}
                loading={projectDeleting}
                semiDanger
                semiSmall
              >
                <>
                  <TrashIcon className='mr-1 h-5 w-5' />
                  {t('project.settings.reset')}
                </>
              </Button>
              <Button
                onClick={() => !projectDeleting && setShowDelete(true)}
                loading={projectDeleting}
                danger
                semiSmall
              >
                <>
                  <ExclamationTriangleIcon className='mr-1 h-5 w-5' />
                  {t('project.settings.delete')}
                </>
              </Button>
            </div>
          )}
        </div>
        {!isSelfhosted && (
          <>
            <hr className='mt-8 border-gray-200 dark:border-gray-600 xs:mt-2 sm:mt-5' />
            <Emails projectId={id} projectName={project.name} />
          </>
        )}
        {!isSelfhosted && (
          <>
            <hr className='mt-2 border-gray-200 dark:border-gray-600 sm:mt-5' />
            <People project={project} isSharedProject={isSharedProject} />
          </>
        )}
      </form>
      <Modal
        onClose={() => setShowDelete(false)}
        onSubmit={onDelete}
        submitText={t('project.settings.delete')}
        closeText={t('common.close')}
        title={t('project.settings.qDelete')}
        message={t('project.settings.deleteHint')}
        submitType='danger'
        type='error'
        isOpened={showDelete}
      />
      <Modal
        onClose={() => setShowReset(false)}
        onSubmit={onReset}
        size='large'
        submitText={t('project.settings.reset')}
        closeText={t('common.close')}
        title={t('project.settings.qReset')}
        message={
          <ModalMessage
            setDateRange={setDateRange}
            dateRange={dateRange}
            setTab={setTab}
            tab={tab}
            t={t}
            pid={id}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filterType={filterType}
            setFilterType={setFilterType}
            language={language}
          />
        }
        submitType='danger'
        type='error'
        isOpened={showReset}
      />
      <Modal
        onClose={() => {
          setShowProtected(false)
          setForm((prev) => ({
            ...prev,
            password: undefined,
          }))
        }}
        onSubmit={onProtected}
        submitText={t('common.save')}
        closeText={t('common.cancel')}
        title={t('project.settings.protected')}
        message={
          <div>
            <p className='mb-4 mt-1 text-sm text-gray-500 dark:text-gray-300'>{t('project.settings.protectedHint')}</p>
            <Input
              name='password'
              type='password'
              label={t('project.settings.password')}
              value={form?.password || ''}
              className='mt-4 px-4 sm:px-0'
              onChange={handleInput}
              error={beenSubmitted ? errors.password : null}
            />
          </div>
        }
        isOpened={showProtected}
      />
      <Modal
        onClose={() => {
          setShowTransfer(false)
        }}
        submitText={t('project.settings.transfer')}
        closeText={t('common.cancel')}
        message={
          <div>
            <h2 className='text-xl font-bold text-gray-700 dark:text-gray-200'>{t('project.settings.transferTo')}</h2>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-200'>
              {t('project.settings.transferHint', {
                name: form.name || DEFAULT_PROJECT_NAME,
              })}
            </p>
            <Input
              name='email'
              type='email'
              label={t('project.settings.transfereeEmail')}
              value={transferEmail}
              placeholder='you@example.com'
              className='mt-4'
              onChange={(e) => setTransferEmail(e.target.value)}
            />
          </div>
        }
        isOpened={showTransfer}
        onSubmit={onTransfer}
      />
    </div>
  )
}

export default memo(withAuthentication(ProjectSettings, auth.authenticated))
