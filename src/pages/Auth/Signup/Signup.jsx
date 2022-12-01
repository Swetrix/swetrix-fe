import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'
import _size from 'lodash/size'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'

import Title from 'components/Title'
import { withAuthentication, auth } from 'hoc/protected'
import routes from 'routes'
import Input from 'ui/Input'
import Checkbox from 'ui/Checkbox'
import Tooltip from 'ui/Tooltip'
import Button from 'ui/Button'
import {
  isValidEmail, isValidPassword, MIN_PASSWORD_CHARS, MAX_PASSWORD_CHARS,
} from 'utils/validator'
import { HAVE_I_BEEN_PWNED_URL } from 'redux/constants'
import { trackCustom } from 'utils/analytics'

const Signup = ({ signup }) => {
  const { t } = useTranslation('common')
  const [form, setForm] = useState({
    email: '',
    password: '',
    repeat: '',
    tos: false,
    dontRemember: false,
    checkIfLeaked: true,
  })
  const [validated, setValidated] = useState(false)
  const [errors, setErrors] = useState({})
  const [beenSubmitted, setBeenSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const allErrors = {}

    if (!isValidEmail(form.email)) {
      allErrors.email = t('auth.common.badEmailError')
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

    if (!form.tos) {
      allErrors.tos = t('auth.common.tosError')
    }

    const valid = _isEmpty(_keys(allErrors))

    setErrors(allErrors)
    setValidated(valid)
  }

  useEffect(() => {
    validate()
  }, [form]) // eslint-disable-line

  const onSubmit = data => {
    if (!isLoading) {
      setIsLoading(true)
      signup(data, t, (result) => {
        if (result) {
          trackCustom('SIGNUP')
        } else {
          setIsLoading(false)
        }
      })
    }
  }

  const handleInput = event => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value

    setForm(oldForm => ({
      ...oldForm,
      [target.name]: value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    setBeenSubmitted(true)

    if (validated) {
      onSubmit(form)
    }
  }

  return (
    <Title title={t('titles.signup')}>
      <div className='min-h-page bg-gray-50 dark:bg-gray-800 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
        <form className='max-w-7xl w-full mx-auto relative ' onSubmit={handleSubmit}>
          <h2 className='mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50'>
            {t('titles.signup')}
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
            error={beenSubmitted ? errors.email : ''}
          />
          <Input
            name='password'
            id='password'
            type='password'
            label={t('auth.common.password')}
            hint={t('auth.common.hint', { amount: MIN_PASSWORD_CHARS })}
            value={form.password}
            placeholder={t('auth.common.password')}
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted ? errors.password : ''}
          />
          <Input
            name='repeat'
            id='repeat'
            type='password'
            label={t('auth.common.repeat')}
            value={form.repeat}
            placeholder={t('auth.common.repeat')}
            className='mt-4'
            onChange={handleInput}
            error={beenSubmitted ? errors.repeat : ''}
          />
          <Checkbox
            checked={form.tos}
            onChange={handleInput}
            name='tos'
            id='tos'
            className='mt-4'
            label={(
              <span>
                <Trans
                  t={t}
                  i18nKey='auth.signup.tos'
                  components={{
                    tos: <Link to={routes.terms} className='font-medium text-gray-900 dark:text-gray-300 hover:underline' />,
                    pp: <Link to={routes.privacy} className='font-medium text-gray-900 dark:text-gray-300 hover:underline' />,
                  }}
                />
              </span>
            )}
            hintClassName='!text-red-600 dark:!text-red-500'
            hint={beenSubmitted ? errors.tos : ''}
          />
          <div className='flex mt-4'>
            <Checkbox
              checked={form.checkIfLeaked}
              onChange={handleInput}
              name='checkIfLeaked'
              id='checkIfLeaked'
              label={t('auth.common.checkLeakedPassword')}
            />
            <Tooltip
              className='ml-2'
              text={(
                <Trans
                  t={t}
                  i18nKey='auth.common.checkLeakedPasswordDesc'
                  components={{
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    db: <a href={HAVE_I_BEEN_PWNED_URL} className='font-medium text-indigo-400 hover:underline hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500' target='_blank' rel='noreferrer noopener' />,
                  }}
                  values={{
                    database: 'haveibeenpwned.com',
                  }}
                />
              )}
            />
          </div>
          <Checkbox
            checked={form.dontRemember}
            onChange={handleInput}
            name='dontRemember'
            id='dontRemember'
            className='mt-4'
            label={t('auth.common.noRemember')}
          />
          <div className='pt-1 flex justify-between mt-3'>
            <Link to={routes.signin} className='underline text-blue-600 hover:text-indigo-800 dark:text-blue-400 dark:hover:text-blue-500'>
              {t('auth.common.signinInstead')}
            </Link>
            <Button type='submit' loading={isLoading} primary large>
              {t('auth.signup.button')}
            </Button>
          </div>
        </form>
      </div>
    </Title>
  )
}

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
}

export default memo(withAuthentication(Signup, auth.notAuthenticated))
