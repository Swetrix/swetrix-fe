import React, { useState, useEffect, memo } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'

import { forgotPassword } from 'api'
import { withAuthentication, auth } from 'hoc/protected'
import routes from 'routesPath'
import Input from 'ui/Input'
import Button from 'ui/Button'
import localizationNotification from 'utils/localizationNotification'
import { isValidEmail } from 'utils/validator'

const ForgotPassword = ({
  createNewPasswordFailed, newPassword,
}: {
  createNewPasswordFailed: (e: string) => void,
  newPassword: (message: string) => void,
}): JSX.Element => {
  const { t }: {
    t: (key: string, param?: {
      [key: string]: string | number,
    }) => string,
  } = useTranslation('common')
  const navigate = useNavigate()
  const [form, setForm] = useState<{
    email: string,
  }>({
    email: '',
  })
  const [validated, setValidated] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    email?: string,
  }>({})
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validate = () => {
    const allErrors = {} as {
      email?: string,
    }

    if (!isValidEmail(form.email)) {
      allErrors.email = t('auth.common.badEmailError')
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    validate()
  }, [form]) // eslint-disable-line

  const onSubmit = async (data: {
    email: string,
  }) => {
    if (!isLoading) {
      setIsLoading(true)

      try {
        await forgotPassword(data)

        newPassword(t('auth.forgot.sent'))
        navigate(routes.main)
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
            {t('titles.recovery')}
          </h2>
          <Input
            name='email'
            id='email'
            type='email'
            label={t('auth.common.email')}
            value={form.email}
            placeholder='you@example.com'
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted && errors.email}
          />
          <div className='flex justify-between mt-3'>
            <Link to={routes.signin} className='mt-1 underline text-blue-600 hover:text-indigo-800 dark:text-blue-400 dark:hover:text-blue-500'>
              {t('auth.common.signin')}
            </Link>
            <Button type='submit' loading={isLoading} primary large>
              {t('auth.forgot.reset')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(withAuthentication(ForgotPassword, auth.notAuthenticated))
