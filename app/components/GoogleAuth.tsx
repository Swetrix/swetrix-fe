import React from 'react'
import type i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'

import Button from 'ui/Button'
import GoogleGSVG from 'ui/icons/GoogleG'
import { SSO_PROVIDERS } from 'redux/constants'

interface IGoogleAuth {
  setIsLoading: (isLoading: boolean) => void
  authSSO: (provider: string, dontRemember: boolean, t: typeof i18next.t, callback: (res: any) => void) => void
  callback?: any
  dontRemember?: boolean
  isMiniButton?: boolean
  className?: string
}

const GoogleAuth: React.FC<IGoogleAuth> = ({
  setIsLoading,
  authSSO,
  dontRemember,
  callback = () => {},
  isMiniButton,
  className,
}) => {
  const { t } = useTranslation()

  const googleLogin = async () => {
    setIsLoading(true)
    authSSO(SSO_PROVIDERS.GOOGLE, dontRemember as boolean, t, callback)
  }

  if (isMiniButton) {
    return (
      <Button
        title={t('auth.common.continueWithGoogle')}
        className={cx(
          className,
          'bg-transparent ring-1 ring-slate-300 hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800/60',
        )}
        onClick={googleLogin}
        secondary
        regular
      >
        <GoogleGSVG className='h-5 w-5' />
      </Button>
    )
  }

  return (
    <Button
      className={cx(
        className,
        'flex items-center justify-center border-indigo-100 dark:border-slate-700/50 dark:bg-slate-800 dark:text-gray-50 dark:hover:bg-slate-700',
      )}
      onClick={googleLogin}
      secondary
      regular
    >
      <>
        <GoogleGSVG className='mr-2 h-5 w-5' />
        {t('auth.common.google')}
      </>
    </Button>
  )
}

export default GoogleAuth
