import React, { useState, useEffect, memo } from 'react'
import { Link, useNavigate, useParams } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import _size from 'lodash/size'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'

import { createNewPassword } from 'api'
import { withAuthentication, auth } from 'hoc/protected'
import routes from 'routesPath'
import Input from 'ui/Input'
import Button from 'ui/Button'
import localizationNotification from 'utils/localizationNotification'
import { isValidPassword, MIN_PASSWORD_CHARS, MAX_PASSWORD_CHARS } from 'utils/validator'

interface FormSubmitData {
  password: string,
  repeat: string,
}

const CreateNewPassword = ({
  createNewPasswordFailed, newPassword,
}: {
  createNewPasswordFailed: (e: string) => void,
  newPassword: (message: string) => void,
}): JSX.Element => {
  const { t }: {
    t: (key: string, options?: { [key: string]: string | number }) => string,
  } = useTranslation('common')
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState<FormSubmitData>({
    password: '',
    repeat: '',
  })
  const [validated, setValidated] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    password?: string,
    repeat?: string,
  }>({})
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validate = () => {
    const allErrors = {} as {
      password?: string,
      repeat?: string,
    }

    if (!isValidPassword(form.password)) {
      allErrors.password = t('auth.common.xCharsError', { amount: MIN_PASSWORD_CHARS })
    }

    if (form.password !== form.repeat || form.repeat === '') {
      allErrors.repeat = t('auth.common.noMatchError')
    }

    if (_size(form.password) > 50) {
      allErrors.password = t('auth.common.passwordTooLong', { amount: MAX_PASSWORD_CHARS })
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    validate()
  }, [form]) // eslint-disable-line

  const onSubmit = async (data: FormSubmitData) => {
    if (!isLoading) {
      setIsLoading(true)
      try {
        const { password } = data
        await createNewPassword(id as string, password)

        newPassword(t('auth.recovery.updated'))
        navigate(routes.signin)
      } catch (e: any) {
        createNewPasswordFailed(t(localizationNotification(e), e.params))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInput = ({ target }: {
    target: HTMLInputElement,
  }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value

    setForm(oldForm => ({
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

  return (
    <div>
      <div className='min-h-page bg-gray-50 dark:bg-slate-900 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
        <form className='max-w-7xl w-full mx-auto' onSubmit={handleSubmit}>
          <h2 className='mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50'>
            {t('auth.recovery.title')}
          </h2>
          <Input
            name='password'
            id='password'
            type='password'
            label={t('auth.recovery.newPassword')}
            hint={t('auth.common.hint', { amount: MIN_PASSWORD_CHARS })}
            value={form.password}
            placeholder={t('auth.common.password')}
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted && errors.password}
          />
          <Input
            name='repeat'
            id='repeat'
            type='password'
            label={t('auth.common.repeat')}
            value={form.repeat}
            placeholder={t('auth.common.password')}
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted && errors.repeat}
          />
          <div className='flex justify-between mt-3'>
            <Link to={routes.signin} className='underline text-blue-600 hover:text-indigo-800 dark:text-blue-400 dark:hover:text-blue-500'>
              {t('auth.common.signinInstead')}
            </Link>
            <Button type='submit' loading={isLoading} primary large>
              {t('auth.recovery.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(withAuthentication(CreateNewPassword, auth.notAuthenticated))
