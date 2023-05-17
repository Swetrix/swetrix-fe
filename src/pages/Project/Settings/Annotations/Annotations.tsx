import React, {
  useState, useEffect,
} from 'react'
import {
  TrashIcon, PencilIcon, InboxStackIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import _findIndex from 'lodash/findIndex'
import _map from 'lodash/map'
import FlatPicker from 'ui/Flatpicker'

import { isValidEmail } from 'utils/validator'

import Input from 'ui/Input'
import Button from 'ui/Button'
import Modal from 'ui/Modal'
import Loader from 'ui/Loader'
import Beta from 'ui/Beta'
import { IAnnotations } from 'redux/models/IAnnotations'

import {
  createAnnotation, deleteAnnotation, updateAnnotation, getAnnotations,
} from 'api'
import Pagination from 'ui/Pagination'

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
  data, onRemove, t, language, showEditModal,
}: {
  data: {
    id: string
    addedAt: string
    name: string
  }
  onRemove: (id: string) => void
  t: (key: string, options?: {
    [key: string]: string | number | boolean | undefined
  }) => string
  language: string,
  showEditModal: (id: string) => void
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const {
    id, addedAt, name,
  } = data

  return (
    <tr className='dark:bg-slate-800'>
      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6'>
        {name}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white'>
        {language === 'en'
          ? dayjs(addedAt).locale(language).format('MMMM D, YYYY')
          : dayjs(addedAt).locale(language).format('D MMMM, YYYY')}
      </td>
      <td className='relative whitespace-nowrap py-4 text-right text-sm font-medium pr-2'>
        <div className='flex gap-3 items-center justify-end'>
          <Button
            type='button'
            className='bg-white text-indigo-700 rounded-md text-base font-medium hover:bg-indigo-50 dark:text-gray-50 dark:border-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700'
            small
            onClick={() => showEditModal(id)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            className='bg-white text-indigo-700 rounded-md text-base font-medium hover:bg-indigo-50 dark:text-gray-50 dark:border-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700'
            small
            onClick={() => setShowDeleteModal(true)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
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
          title={t('project.settings.removeAnnotation')}
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

const NoAnnotations = ({ t }: {
  t: (string: string) => string,
}): JSX.Element => (
  <div className='flex flex-col py-6 sm:px-6 lg:px-8'>
    <div className='max-w-7xl w-full mx-auto text-gray-900 dark:text-gray-50'>
      <h2 className='text-2xl mb-8 text-center leading-snug'>
        {t('project.settings.noAnnotations')}
      </h2>
    </div>
  </div>
)

const Annotations = ({
  genericError, addAnnotations, removeAnnotations, setProjectAnnotations, projectId, projectName, reportTypeNotifiction,
}: {
  genericError: (message: string, type?: string) => void
  addAnnotations: (message: string, type?: string) => void
  removeAnnotations: (message: string) => void
  setProjectAnnotations: (idProject: string, annotations: IAnnotations[]) => void
  projectId: string
  projectName: string
  reportTypeNotifiction: (message: string, type?: string) => void
}): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editAnnotationId, setEditAnnotationId] = useState<string>('')
  const { t, i18n: { language } }: {
    t: (string: string, options?: {
      [key: string]: string | number | boolean | undefined | null
    }) => string,
    i18n: { language: string },
  } = useTranslation('common')
  const [form, setForm] = useState<{
    name: string,
    date: Date | undefined,
    isEdit: boolean,
  }>({
    name: '',
    date: undefined,
    isEdit: false,
  })
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    name?: string,
    date?: string,
  }>({})
  const [validated, setValidated] = useState<boolean>(false)
  const [annotions, setAnnotions] = useState<IAnnotations[]>([])
  const [loading, setLoading] = useState(true)
  const [paggination, setPaggination] = useState({
    page: 1,
    limit: 10,
    count: 0,
  })
  const pageAmount: number = Math.ceil(paggination.count / paggination.limit)

  const getAnnotationsAsync = async () => {
    try {
      // @ts-ignore
      const { annotations, count } = await getAnnotations(projectId, paggination.limit, (paggination.page - 1) * paggination.limit)
      setPaggination(oldPaggination => ({
        ...oldPaggination,
        count,
      }))
      setProjectAnnotations(projectId, annotations)
      setAnnotions(annotations)
    } catch (e) {
      console.error(`[ERROR] Error while getting annotations: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAnnotationsAsync()
  }, [paggination.page, paggination.count]) // eslint-disable-line

  const validate = () => {
    const allErrors: {
      name?: string,
      date?: string,
    } = {}

    if (!form.name) {
      allErrors.name = t('auth.common.requiredField')
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
      if (form.isEdit) { // if there was an edit, then call updateAnnotations, otherwise addAnnotations
        // @ts-ignore
        const results = await updateAnnotation(projectId, editAnnotationId, { date: form.date, name: form.name })
        const editIndex = _findIndex(annotions, s => s.id === editAnnotationId)
        const newAnnotations = [...annotions.slice(0, editIndex), results, ...annotions.slice(editIndex + 1)]
        setProjectAnnotations(projectId, newAnnotations)
        setAnnotions(newAnnotations)
        addAnnotations(t('apiNotifications.userEdited'))

        // @ts-ignore
      } else {
        // @ts-ignore
        const results = await createAnnotation(projectId, { date: form.date, name: form.name })
        setAnnotions([...annotions, results])
        setProjectAnnotations(projectId, [...annotions, results])
        addAnnotations(t('apiNotifications.userInvited'))
      }
      getAnnotationsAsync()
    } catch (e) {
      console.error(`[ERROR] Error while inviting a user: ${e}`)
      addAnnotations(t('apiNotifications.userInviteError'), 'error')
    }

    // a timeout is needed to prevent the flicker of data fields in the modal when closing
    setTimeout(() => setForm({ name: '', date: undefined, isEdit: false }), 300)
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
    setTimeout(() => setForm({ name: '', date: undefined, isEdit: false }), 300)
    setErrors({})
  }

  const showEditModal = (id: string) => {
    setForm(oldForm => ({
      ...oldForm,
      isEdit: true,
    }))
    setEditAnnotationId(id)
    setShowModal(true)
  }

  const onRemove = async (name: string) => {
    try {
      await deleteAnnotation(projectId, name)
      const results = _filter(annotions, s => s.id !== name)
      setAnnotions(results)
      setProjectAnnotations(projectId, results)
      removeAnnotations(t('apiNotifications.emailDelete'))
      getAnnotationsAsync()
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
              {(!loading && !_isEmpty(annotions)) && (
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
                      {_map(annotions, email => (
                        <AnnotationsList
                          data={email}
                          key={email.id}
                          onRemove={onRemove}
                          t={t}
                          language={language}
                          showEditModal={showEditModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {_isEmpty(annotions) && (
                <NoAnnotations t={t} />
              )}
              {loading && (
                <Loader />
              )}
            </div>
          </div>
          {(pageAmount > 1) && (
          <Pagination
            className='mt-2'
            page={paggination.page}
            pageAmount={pageAmount}
            setPage={(page) => setPaggination(oldPaggination => ({
              ...oldPaggination,
              page,
            }))}
            total={paggination.count}
          />
          )}
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
