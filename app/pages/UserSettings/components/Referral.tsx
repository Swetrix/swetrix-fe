import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { IUser } from 'redux/models/IUser'

interface IReferral {
  user: IUser,
  genericError: (message: string) => void,
  theme: string
}

const Referral = ({
  user, genericError, theme,
}: IReferral) => {
  const { t }: {
    t: (key: string) => string,
  } = useTranslation('common')


  return (
    <>
      <p className='max-w-prose text-base text-gray-900 dark:text-gray-50'>
        {t('profileSettings.socialisationsDesc')}
      </p>
      <div className='overflow-hidden bg-white dark:bg-slate-800 mt-2 shadow sm:rounded-md'>
        referral program
      </div>
    </>
  )
}

export default memo(Referral)
