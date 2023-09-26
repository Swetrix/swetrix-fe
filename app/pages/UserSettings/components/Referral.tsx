import React, {
  memo, useState, useRef, useEffect,
} from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'

import { generateRefCode } from 'api'
import Input from 'ui/Input'
import Button from 'ui/Button'
import { IUser } from 'redux/models/IUser'

const REFERRAL_PROGRAM_DOCS_URL = 'https://docs.swetrix.com'

interface IReferral {
  user: IUser,
  genericError: (message: string) => void,
  updateUserData: (data: Partial<IUser>) => void,
}

const Referral = ({
  user, genericError, updateUserData,
}: IReferral) => {
  const { t }: {
    t: (key: string) => string,
  } = useTranslation('common')
  const [copied, setCopied] = useState(false)
  const [apiKeyGenerating, setApiKeyGenerating] = useState(false)
  const copyTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(copyTimerRef.current)
    }
  }, [])

  const onRefCodeGenerate = async () => {
    if (apiKeyGenerating || user.refCode) {
      return
    }

    setApiKeyGenerating(true)

    try {
      const { refCode } = await generateRefCode()
      updateUserData({
        refCode,
      })
    } catch (e) {
      genericError(t('apiNotifications.somethingWentWrong'))
    } finally {
      setApiKeyGenerating(false)
    }
  }

  const setToClipboard = (value: string) => {
    if (!copied) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      // @ts-ignore
      copyTimerRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return (
    <>
      <p className='text-base text-gray-900 dark:text-gray-50'>
        <Trans
          t={t}
          i18nKey='profileSettings.referral.desc'
          components={{
            url: <a
              href={REFERRAL_PROGRAM_DOCS_URL}
              className='font-medium hover:underline text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'
              target='_blank'
              rel='noreferrer noopener'
            />,
          }}
        />
      </p>
      <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
        {t('profileSettings.referral.referralLink')}
      </h3>
      <p className='max-w-prose text-base text-gray-900 dark:text-gray-50'>
        {t('profileSettings.referral.referralLinkDesc')}
      </p>
      {user.refCode && (
        <p className='mt-4 max-w-prose text-base text-gray-900 dark:text-gray-50'>
          {t('profileSettings.referral.yourReferralLink')}
        </p>
      )}
      {user.refCode ? (
        <div className='grid grid-cols-1 gap-y-6 gap-x-4 lg:grid-cols-2'>
          <div className='relative group'>
            <Input
              name='apiKey'
              id='apiKey'
              type='text'
              className='pr-9'
              value={`https://swetrix.com/?rc=${user.refCode}`}
              disabled
            />
            <div className='absolute right-2 top-3'>
              <div className='group relative'>
                <Button
                  type='button'
                  onClick={() => setToClipboard(`https://swetrix.com/?rc=${user.refCode}`)}
                  className='opacity-70 hover:opacity-100'
                  noBorder
                >
                  <>
                    <ClipboardDocumentIcon className='w-6 h-6' />
                    {copied && (
                      <div className='animate-appear bg-white dark:bg-slate-800 cursor-auto rounded p-1 absolute sm:top-0 top-0.5 right-8 text-xs text-green-600'>
                        {t('common.copied')}
                      </div>
                    )}
                  </>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button
          className='mt-2'
          onClick={onRefCodeGenerate}
          loading={apiKeyGenerating}
          primary
          large
        >
          {t('profileSettings.referral.generateRefLink')}
        </Button>
      )}
      <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
        {t('profileSettings.referral.referralStats')}
      </h3>
      <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
        {t('profileSettings.referral.activeReferrals')}
      </h3>
    </>
  )
}

export default memo(Referral)
