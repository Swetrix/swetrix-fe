import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from '@remix-run/react'
import { useTranslation, Trans } from 'react-i18next'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _replace from 'lodash/replace'
import _find from 'lodash/find'
import _split from 'lodash/split'
import _keys from 'lodash/keys'
import _filter from 'lodash/filter'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import _findKey from 'lodash/findKey'
import _toNumber from 'lodash/toNumber'
import { clsx as cx } from 'clsx'
import Input from 'ui/Input'
import Button from 'ui/Button'
import Checkbox from 'ui/Checkbox'
import Modal from 'ui/Modal'
import { PROJECT_TABS, QUERY_CONDITION, QUERY_METRIC, QUERY_TIME } from 'redux/constants'
import { createAlert, updateAlert, deleteAlert, ICreateAlert } from 'api'
import { withAuthentication, auth } from 'hoc/protected'
import routes from 'routesPath'
import Select from 'ui/Select'
import { IAlerts } from 'redux/models/IAlerts'
import { IUser } from 'redux/models/IUser'

const INTEGRATIONS_LINK = `${routes.user_settings}#integrations`

interface IProjectAlertsSettings {
  alerts: IAlerts[]
  setProjectAlerts: (item: IAlerts[]) => void
  showError: (message: string) => void
  user: IUser
  setProjectAlertsTotal: (num: number) => void
  total: number
  generateAlerts: (message: string) => void
  loading: boolean
}

const ProjectAlertsSettings = ({
  alerts,
  setProjectAlerts,
  showError,
  user,
  setProjectAlertsTotal,
  total,
  generateAlerts,
  loading,
}: IProjectAlertsSettings): JSX.Element => {
  const navigate = useNavigate()
  const { id, pid } = useParams()
  const { pathname } = useLocation()
  const { t } = useTranslation('common')
  const isSettings: boolean =
    !_isEmpty(id) && _replace(_replace(routes.alert_settings, ':id', id as string), ':pid', pid as string) === pathname
  const alert = useMemo(() => _find(alerts, { id }), [alerts, id])
  const [form, setForm] = useState<Partial<IAlerts>>({
    pid,
    name: '',
    queryTime: QUERY_TIME.LAST_1_HOUR,
    queryCondition: QUERY_CONDITION.GREATER_THAN,
    queryMetric: QUERY_METRIC.PAGE_VIEWS,
    active: true,
    queryCustomEvent: '',
  })
  const [validated, setValidated] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    [key: string]: string
  }>({})
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const isIntegrationLinked = useMemo(() => {
    return !_isEmpty(user) && user.telegramChatId && user.isTelegramChatIdConfirmed
  }, [user])

  const queryTimeTMapping: {
    [key: string]: string
  } = useMemo(() => {
    const values = _values(QUERY_TIME)

    return _reduce(
      values,
      (prev, curr) => {
        const [, amount, metric] = _split(curr, '_')
        let translated

        if (metric === 'minutes') {
          translated = t('alert.xMinutes', { amount })
        }

        if (metric === 'hour') {
          translated = t('alert.xHour', { amount })
        }

        if (metric === 'hours') {
          translated = t('alert.xHours', { amount })
        }

        return {
          ...prev,
          [curr]: translated,
        }
      },
      {},
    )
  }, [t])

  const queryConditionTMapping: {
    [key: string]: string
  } = useMemo(() => {
    const values = _values(QUERY_CONDITION)

    return _reduce(
      values,
      (prev, curr) => ({
        ...prev,
        [curr]: t(`alert.conditions.${curr}`),
      }),
      {},
    )
  }, [t])

  const queryMetricTMapping: {
    [key: string]: string
  } = useMemo(() => {
    const values = _values(QUERY_METRIC)

    return _reduce(
      values,
      (prev, curr) => ({
        ...prev,
        [curr]: t(`alert.metrics.${curr}`),
      }),
      {},
    )
  }, [t])

  useEffect(() => {
    if (!_isEmpty(alert)) {
      setForm(alert)
    }
  }, [alert])

  const validate = () => {
    const allErrors: {
      [key: string]: string
    } = {}

    if (_isEmpty(form.name) || _size(form.name) < 3) {
      allErrors.name = t('alert.noNameError')
    }

    if (form.queryMetric === QUERY_METRIC.CUSTOM_EVENTS && _isEmpty(form.queryCustomEvent)) {
      allErrors.queryCustomEvent = t('alert.noCustomEventError')
    }

    if (Number.isNaN(_toNumber(form.queryValue))) {
      allErrors.queryValue = t('alert.queryValueError')
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  const onSubmit = (data: Partial<IAlerts>) => {
    if (isSettings) {
      updateAlert(id as string, data)
        .then((res) => {
          navigate(`/projects/${pid}?tab=${PROJECT_TABS.alerts}`)
          setProjectAlerts([..._filter(alerts, (a) => a.id !== id), res])
          generateAlerts(t('alertsSettings.alertUpdated'))
        })
        .catch((err) => {
          showError(err.message || err || 'Something went wrong')
        })
    } else {
      createAlert(data as ICreateAlert)
        .then((res) => {
          navigate(`/projects/${pid}?tab=${PROJECT_TABS.alerts}`)
          setProjectAlerts([...alerts, res])
          setProjectAlertsTotal(total + 1)
          generateAlerts(t('alertsSettings.alertCreated'))
        })
        .catch((err) => {
          showError(err.message || err || 'Something went wrong')
        })
    }
  }

  const onDelete = () => {
    if (!id) {
      showError('Something went wrong')
      return
    }

    deleteAlert(id)
      .then(() => {
        setProjectAlerts(_filter(alerts, (a) => a.id !== id))
        setProjectAlertsTotal(total - 1)
        navigate(`/projects/${pid}?tab=${PROJECT_TABS.alerts}`)
        generateAlerts(t('alertsSettings.alertDeleted'))
      })
      .catch((err) => {
        showError(err.message || err || 'Something went wrong')
      })
  }

  const onCancel = () => {
    navigate(`/projects/${pid}?tab=${PROJECT_TABS.alerts}`)
  }

  useEffect(() => {
    validate()
  }, [form]) // eslint-disable-line

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event

    setForm((prevForm) => ({
      ...prevForm,
      [target.name]: target.value,
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

  const title = isSettings
    ? t('alert.settingsOf', {
        name: form.name,
      })
    : t('alert.create')

  return (
    <div
      className={cx('flex min-h-min-footer flex-col bg-gray-50 px-4 py-6 dark:bg-slate-900 sm:px-6 lg:px-8', {
        'pb-40': isSettings,
      })}
    >
      <form className='mx-auto w-full max-w-7xl' onSubmit={handleSubmit}>
        <h2 className='mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50'>{title}</h2>
        {!loading && !isIntegrationLinked && (
          <div className='mt-2 flex items-center whitespace-pre-wrap rounded bg-blue-50 px-5 py-3 text-base dark:bg-slate-800 dark:text-gray-50'>
            <ExclamationTriangleIcon className='mr-1 h-5 w-5' />
            <Trans
              // @ts-ignore
              t={t}
              i18nKey='alert.noIntegration'
              components={{
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                url: <Link to={INTEGRATIONS_LINK} className='text-blue-600 hover:underline dark:text-blue-500' />,
              }}
            />
          </div>
        )}
        <Input
          name='name'
          label={t('alert.name')}
          value={form.name || ''}
          placeholder={t('alert.name')}
          className='mt-4'
          onChange={handleInput}
          error={beenSubmitted ? errors.name : null}
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
          label={t('alert.enabled')}
          hint={t('alert.enabledHint')}
        />
        <div className='mt-4'>
          <Select
            id='queryMetric'
            label={t('alert.metric')}
            items={_values(queryMetricTMapping)}
            title={form.queryMetric ? queryMetricTMapping[form.queryMetric] : ''}
            onSelect={(item) => {
              const key = _findKey(queryMetricTMapping, (predicate) => predicate === item)

              setForm((prevForm) => ({
                ...prevForm,
                queryMetric: key,
              }))
            }}
            capitalise
          />
        </div>
        {form.queryMetric === QUERY_METRIC.CUSTOM_EVENTS && (
          <Input
            name='queryCustomEvent'
            label={t('alert.customEvent')}
            value={form.queryCustomEvent || ''}
            placeholder={t('alert.customEvent')}
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted ? errors.queryCustomEvent : null}
          />
        )}
        <div className='mt-4'>
          <Select
            id='queryCondition'
            label={t('alert.condition')}
            items={_values(queryConditionTMapping)}
            title={form.queryCondition ? queryConditionTMapping[form.queryCondition] : ''}
            onSelect={(item) => {
              const key = _findKey(queryConditionTMapping, (predicate) => predicate === item)

              setForm((prevForm) => ({
                ...prevForm,
                queryCondition: key,
              }))
            }}
            capitalise
          />
        </div>
        <Input
          name='queryValue'
          label={t('alert.threshold')}
          value={form.queryValue || ''}
          placeholder='10'
          className='mt-4'
          onChange={handleInput}
          error={beenSubmitted ? errors.queryValue : null}
        />
        <div className='mt-4'>
          <Select
            id='queryTime'
            label={t('alert.time')}
            items={_values(queryTimeTMapping)}
            title={form.queryTime ? queryTimeTMapping[form.queryTime] : ''}
            onSelect={(item) => {
              const key = _findKey(queryTimeTMapping, (predicate) => predicate === item)

              setForm((prevForm) => ({
                ...prevForm,
                queryTime: key,
              }))
            }}
            capitalise
          />
        </div>
        {isSettings ? (
          <div className='mt-5 flex items-center justify-between'>
            <Button onClick={() => setShowModal(true)} danger semiSmall>
              <>
                <ExclamationTriangleIcon className='mr-1 h-5 w-5' />
                {t('alert.delete')}
              </>
            </Button>
            <div className='flex items-center justify-between'>
              <Button
                className='mr-2 border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800 dark:text-gray-50 dark:hover:bg-slate-700'
                onClick={onCancel}
                secondary
                regular
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' primary regular>
                {t('common.save')}
              </Button>
            </div>
          </div>
        ) : (
          <div className='mt-5 flex items-center justify-between'>
            <Button
              className='mr-2 border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800 dark:text-gray-50 dark:hover:bg-slate-700'
              onClick={onCancel}
              secondary
              regular
            >
              {t('common.cancel')}
            </Button>
            <Button type='submit' primary regular>
              {t('common.save')}
            </Button>
          </div>
        )}
      </form>
      <Modal
        onClose={() => setShowModal(false)}
        onSubmit={onDelete}
        submitText={t('alert.delete')}
        closeText={t('common.close')}
        title={t('alert.qDelete')}
        message={t('alert.deleteHint')}
        submitType='danger'
        type='error'
        isOpened={showModal}
      />
    </div>
  )
}

export default withAuthentication(ProjectAlertsSettings, auth.authenticated)
