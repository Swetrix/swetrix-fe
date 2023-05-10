import React, {
  useState, useEffect, useRef,
} from 'react'
import {
  TrashIcon, InboxStackIcon, ChevronDownIcon, CheckIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import _map from 'lodash/map'
import _toLower from 'lodash/toLower'
import FlatPicker from 'ui/Flatpicker'

import {
  removeSubscriber, getSubscribers, updateSubscriber,
} from 'api'

import { isValidEmail } from 'utils/validator'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { reportFrequencyForEmailsOptions } from 'redux/constants'

import Input from 'ui/Input'
import Button from 'ui/Button'
import Modal from 'ui/Modal'
import Loader from 'ui/Loader'
import Beta from 'ui/Beta'
import cx from 'clsx'
import { WarningPin } from 'ui/Pin'
import { ISubscribers } from 'redux/models/ISubscribers'

const ModalMessage = ({
  project, handleInput, beenSubmitted, errors, form, t, setForm,
}: {
  project: string
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  beenSubmitted: boolean
  errors: {
    name?: string
    date?: string
  }
  form: {
    name: string
    date: Date | undefined
  }
  t: (key: string, options?: {
    [key: string]: string | number | boolean | undefined
  }) => string
  setForm: any
}): JSX.Element => (
  <div>
    <h2 className='text-xl font-bold text-gray-700 dark:text-gray-200'>
      {t('project.settings.annotainos')}
    </h2>
    <p className=' text-base text-gray-700 dark:text-gray-200'>
      {t('project.settings.annotainosDescription')}
    </p>
    <Input
      name='name'
      id='name'
      type='text'
      label={t('auth.common.name')}
      value={form.name}
      placeholder='annotainos name'
      className='mt-4'
      onChange={handleInput}
      error={beenSubmitted && errors.name}
    />
    <p className='text-gray-500 dark:text-gray-300 text-sm'>
      {t('project.settings.selectDate')}
    </p>
    <input type='text' className='h-0 w-0 border-0 p-0 m-0 focus:text-transparent focus:border-transparent focus:shadow-none focus:ring-transparent' />
    <FlatPicker
      onChange={(date) => {
        console.log(date)
        setForm((prev: any) => ({
          ...prev,
          date: dayjs(date[0]).format('YYYY-MM-DD'),
        }))
      }}
      options={{
        altInputClass: 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:text-gray-50 dark:placeholder-gray-400 dark:border-gray-800 dark:bg-slate-800 rounded-md',
        mode: 'single',
      }}
      value={form.date}
    />
  </div>
)

const AnnotationsList = ({
  data, onRemove, t, setAnnotations, genericError, language, reportTypeNotifiction,
}: {
  data: {
    id: string
    addedAt: string
    isConfirmed: boolean
    projectId: string
    email: string
    reportFrequency: string
  }
  onRemove: (id: string) => void
  t: (key: string, options?: {
    [key: string]: string | number | boolean | undefined
  }) => string
  setAnnotations: (value: ISubscribers[] | ((prevVar: ISubscribers[]) => ISubscribers[])) => void;
  genericError: (message: string) => void
  language: string
  reportTypeNotifiction: (message: string) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const openRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(openRef, () => setOpen(false))
  const {
    id, addedAt, isConfirmed, projectId, email, reportFrequency,
  } = data

  const changeRole = async (reportType: {
    value: string
    label: string
  }) => {
    try {
      const results = await updateSubscriber(projectId, id, { reportFrequency: reportType.value })
      setAnnotations((prev) => {
        const newEmails = _map(prev, (item) => {
          if (item.id === results.id) {
            return results
          }
          return item
        })
        return newEmails
      })
      reportTypeNotifiction(t('apiNotifications.roleUpdated'))
    } catch (e) {
      console.error(`[ERROR] Error while updating user's role: ${e}`)
      genericError(t('apiNotifications.roleUpdateError'))
    }

    setOpen(false)
  }

  return (
    <tr className='dark:bg-slate-800'>
      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6'>
        {email}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white'>
        {language === 'en'
          ? dayjs(addedAt).locale(language).format('MMMM D, YYYY')
          : dayjs(addedAt).locale(language).format('D MMMM, YYYY')}
      </td>
      <td className='relative whitespace-nowrap py-4 text-right text-sm font-medium pr-2'>
        {isConfirmed ? (
          <div ref={openRef}>
            <button
              onClick={() => setOpen(!open)}
              type='button'
              className='inline-flex items-center shadow-sm pl-2 pr-1 py-0.5 border border-gray-200 dark:border-gray-600 text-sm leading-5 font-medium rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            >
              {t(`profileSettings.${_toLower(reportFrequency)}`)}
              <ChevronDownIcon
                style={{ transform: open ? 'rotate(180deg)' : '' }}
                className='w-4 h-4 pt-px ml-0.5'
              />
            </button>
            {open && (
              <ul className='text-left origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none'>
                {_map(reportFrequencyForEmailsOptions, (item) => (
                  <li onClick={() => changeRole(item)} className='p-4 hover:bg-indigo-600 group cursor-pointer flex justify-between items-center' key={item.value}>
                    <div>
                      <p className='font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-200'>
                        {t(`profileSettings.${_toLower(item.label)}`)}
                      </p>
                    </div>
                    {reportFrequency === item.value && (
                      <span className='text-indigo-600 group-hover:text-gray-200'>
                        <CheckIcon className='w-7 h-7 pt-px ml-1' />
                      </span>
                    )}
                  </li>
                ))}
                <li onClick={() => { setOpen(false); setShowDeleteModal(true) }} className='p-4 hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer flex justify-between items-center'>
                  <div>
                    <p className='font-bold text-red-600 dark:text-red-500'>
                      {t('project.settings.removeMember')}
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className='flex items-center justify-end'>
            <WarningPin
              label={t('common.pending')}
              className='inline-flex items-center shadow-sm px-2.5 py-0.5 mr-3'
            />
            <Button
              type='button'
              className='bg-white text-indigo-700 rounded-md text-base font-medium hover:bg-indigo-50 dark:text-gray-50 dark:border-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700'
              small
              onClick={() => setShowDeleteModal(true)}
            >
              <TrashIcon className='h-4 w-4' />
            </Button>
          </div>
        )}
      </td>
      <td>
        <Modal
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onSubmit={() => {
            setShowDeleteModal(false)
            onRemove(id)
          }}
          submitText={t('common.yes')}
          type='confirmed'
          closeText={t('common.no')}
          title={t('project.settings.removeUser', { user: email })}
          message={t('project.settings.removeReportConfirm')}
          isOpened={showDeleteModal}
        />
      </td>
    </tr>
  )
}

AnnotationsList.propTypes = {
  data: PropTypes.shape({
    created: PropTypes.string,
    name: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
}

AnnotationsList.defaultProps = {
  data: {},
}

const NoSubscribers = ({ t }: {
  t: (string: string) => string,
}): JSX.Element => (
  <div className='flex flex-col py-6 sm:px-6 lg:px-8'>
    <div className='max-w-7xl w-full mx-auto text-gray-900 dark:text-gray-50'>
      <h2 className='text-2xl mb-8 text-center leading-snug'>
        {t('project.settings.noPeople')}
      </h2>
    </div>
  </div>
)

const Annotations = ({
  genericError, addAnnotations, removeAnnotations, projectId, projectName, reportTypeNotifiction,
}: {
  genericError: (message: string, type?: string) => void
  addAnnotations: (message: string, type?: string) => void
  removeAnnotations: (message: string) => void
  projectId: string
  projectName: string
  reportTypeNotifiction: (message: string, type?: string) => void
}): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { t, i18n: { language } }: {
    t: (string: string, options?: {
      [key: string]: string | number | boolean | undefined | null
    }) => string,
    i18n: { language: string },
  } = useTranslation('common')
  const [form, setForm] = useState<{
    name: string,
    date: Date | undefined,
  }>({
    name: '',
    date: undefined,
  })
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    name?: string,
    date?: string,
  }>({})
  const [validated, setValidated] = useState<boolean>(false)
  const [annotations, setAnnotations] = useState<ISubscribers[]>([])
  const [loading, setLoading] = useState(true)
  const [paggination, setPaggination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  const getSubcribersAsync = async () => {
    try {
      const { subscribers, count } = await getSubscribers(projectId, paggination.page - 1, paggination.limit)
      setPaggination(oldPaggination => ({
        ...oldPaggination,
        count,
      }))
      setAnnotations(subscribers)
    } catch (e) {
      console.error(`[ERROR] Error while getting subscribers: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubcribersAsync()
  }, []) // eslint-disable-line

  const validate = () => {
    const allErrors: {
      name?: string,
      date?: string,
    } = {}

    if (!isValidEmail(form.name)) {
      allErrors.name = t('auth.common.badEmailError')
    }

    if (!form.date) {
      allErrors.date = t('auth.common.requiredField')
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    if (showModal) {
      validate()
    }
  }, [form]) // eslint-disable-line

  const handleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.type === 'checkbox' ? target.checked : target.value

    setForm(oldForm => ({
      ...oldForm,
      [target.name]: value,
    }))
  }

  const onSubmit = async () => {
    setShowModal(false)
    setErrors({})
    setValidated(false)

    try {
      const results = [] as unknown as ISubscribers // await addSubscriber(projectId, { date: form.date, name: form.name })
      setAnnotations([...annotations, results])
      addAnnotations(t('apiNotifications.userInvited'))
    } catch (e) {
      console.error(`[ERROR] Error while inviting a user: ${e}`)
      addAnnotations(t('apiNotifications.userInviteError'), 'error')
    }

    // a timeout is needed to prevent the flicker of data fields in the modal when closing
    setTimeout(() => setForm({ name: '', date: undefined }), 300)
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    setBeenSubmitted(true)
    if (validated) {
      onSubmit()
    } else {
      validate()
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // a timeout is needed to prevent the flicker of data fields in the modal when closing
    setTimeout(() => setForm({ name: '', date: undefined }), 300)
    setErrors({})
  }

  const onRemove = async (email: string) => {
    try {
      await removeSubscriber(projectId, email)
      const results = _filter(annotations, s => s.id !== email)
      setAnnotations(results)
      removeAnnotations(t('apiNotifications.emailDelete'))
    } catch (e) {
      console.error(`[ERROR] Error while deleting a email: ${e}`)
      genericError(t('apiNotifications.emailDeleteError'))
    }
  }

  return (
    <div className='mt-6 mb-6'>
      <div className='flex justify-between items-center mb-3'>
        <div>
          <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
            {t('project.annotations.title')}
            <div className='ml-5'>
              <Beta />
            </div>
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {t('project.annotations.description')}
          </p>
        </div>
        <Button
          className='h-8 pl-2'
          primary
          regular
          type='button'
          onClick={() => setShowModal(true)}
        >
          <>
            <InboxStackIcon className='w-5 h-5 mr-1' />
            {t('project.annotations.add')}
          </>
        </Button>
      </div>
      <div>
        <div className='mt-3 flex flex-col'>
          <div className='-my-2 -mx-4 overflow-x-auto md:overflow-x-visible sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 md:px-6 lg:px-8'>
              {(!loading && !_isEmpty(annotations)) && (
                <div className='shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-300 dark:divide-gray-600'>
                    <thead>
                      <tr className='dark:bg-slate-800'>
                        <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white'>
                          {t('auth.common.annotations')}
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                          {t('auth.common.addedOn')}
                        </th>
                        <th scope='col' />
                        <th scope='col' />
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-300 dark:divide-gray-600'>
                      {_map(annotations, email => (
                        <AnnotationsList
                          data={email}
                          key={email.id}
                          onRemove={onRemove}
                          t={t}
                          language={language}
                          setAnnotations={setAnnotations}
                          genericError={genericError}
                          reportTypeNotifiction={reportTypeNotifiction}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {_isEmpty(annotations) && (
                <NoSubscribers t={t} />
              )}
              {loading && (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        onClose={closeModal}
        customButtons={(
          <button
            type='button'
            className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm bg-indigo-600 hover:bg-indigo-700'
            onClick={handleSubmit}
          >
            {t('project.annotations.add')}
          </button>
        )}
        closeText={t('common.cancel')}
        message={(
          <ModalMessage
            t={t}
            project={projectName}
            form={form}
            handleInput={handleInput}
            errors={errors}
            beenSubmitted={beenSubmitted}
            setForm={setForm}
          />
        )}
        isOpened={showModal}
      />
    </div>
  )
}

Annotations.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  genericError: PropTypes.func.isRequired,
  addAnnotations: PropTypes.func.isRequired,
  removeAnnotations: PropTypes.func.isRequired,
}

export default Annotations
