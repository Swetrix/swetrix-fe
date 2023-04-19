import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'clsx'

import Button from 'ui/Button'
import { StateType } from 'redux/store/index'
import TwitterSVG from 'ui/icons/Twitter'
import { SSO_PROVIDERS } from 'redux/constants'

interface ITwitterAuth {
  setIsLoading: (isLoading: boolean) => void,
  authSSO: (provider: string, dontRemember: boolean, t: (key: string) => string, callback: (res: any) => void) => void
  callback?: any,
  dontRemember?: boolean,
  isMiniButton?: boolean,
  className?: string
}

const TwitterAuth: React.FC<ITwitterAuth> = ({
  setIsLoading, authSSO, dontRemember, callback, isMiniButton, className,
}) => {
  const { t } = useTranslation()
  const { theme } = useSelector((state: StateType) => state.ui.theme)

  const googleLogin = async () => {
    setIsLoading(true)
    authSSO(
      SSO_PROVIDERS.TWITTER,
      dontRemember as boolean,
      t,
      callback,
    )
  }

  if (isMiniButton) {
    return (
      <Button
        className={cx(className, 'border-indigo-100 dark:text-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600')}
        onClick={googleLogin}
        secondary
        regular
      >
        {theme === 'dark' ? (
          <TwitterSVG className='w-5 h-5' />
        ) : (
          <TwitterSVG className='w-5 h-5' />
        )}
      </Button>
    )
  }

  return (
    <Button
      className={cx(className, 'border-indigo-100 dark:text-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600')}
      onClick={googleLogin}
      secondary
      regular
    >
      <>
        {theme === 'dark' ? (
          <TwitterSVG className='w-5 h-5 mr-2' />
        ) : (
          <TwitterSVG className='w-5 h-5 mr-2' />
        )}
        {t('auth.common.continueWithTwitter')}
      </>
    </Button>
  )
}

TwitterAuth.defaultProps = {
  dontRemember: false,
  isMiniButton: false,
  callback: () => { },
  className: '',
}

export default TwitterAuth
