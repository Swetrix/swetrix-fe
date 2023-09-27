import React, {
  memo, useState, useRef, useEffect,
} from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import _isEmpty from 'lodash/isEmpty'

import { generateRefCode, getPayoutsInfo } from 'api'
import Tooltip from 'ui/Tooltip'
import Highlighted from 'ui/Highlighted'
import Input from 'ui/Input'
import Button from 'ui/Button'
import { IUser } from 'redux/models/IUser'
import {
  REF_URL_PREFIX, DOCS_REFERRAL_PROGRAM_URL, REFERRAL_PENDING_PAYOUT_DAYS,
} from 'redux/constants'

interface IReferral {
  user: IUser,
  genericError: (message: string) => void,
  updateUserData: (data: Partial<IUser>) => void,
  setCache: (key: string, value: any) => void,
  activeReferrals: any[],
  referralStatistics: any,
}

const Referral = ({
  user, genericError, updateUserData, referralStatistics, activeReferrals, setCache,
}: IReferral) => {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState(false)
  const [apiKeyGenerating, setApiKeyGenerating] = useState(false)
  const [referralStatsRequested, setReferralStatsRequested] = useState(false)
  // const [activeReferralsRequested, setActiveReferralsRequested] = useState(false)
  const copyTimerRef = useRef(null)

  const refUrl = `${REF_URL_PREFIX}${user?.refCode}`

  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(copyTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const getRefStats = async () => {
      try {
        const info = await getPayoutsInfo()
        setCache('referralStatistics', info)
      } catch (reason) {
        console.error('[Referral][getRefStats] Something went wrong whilst requesting payouts information', reason)
        genericError(t('apiNotifications.payoutInfoError'))
      }
    }

    if (!referralStatsRequested && _isEmpty(referralStatistics)) {
      setReferralStatsRequested(true)
      getRefStats()
    }
  }, [referralStatistics, referralStatsRequested, setCache, genericError, t])

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
          // @ts-ignore
          t={t}
          i18nKey='profileSettings.referral.desc'
          components={{
            url: <a
              href={DOCS_REFERRAL_PROGRAM_URL}
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
              value={refUrl}
              disabled
            />
            <div className='absolute right-2 top-3'>
              <div className='group relative'>
                <Button
                  type='button'
                  onClick={() => setToClipboard(refUrl)}
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
      {!_isEmpty(referralStatistics) && (
        <>
          <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
            {t('profileSettings.referral.referralStats')}
          </h3>
          <div>
            <Tooltip
              text={t('profileSettings.referral.trialDesc')}
              tooltipNode={(
                <span className='text-gray-900 dark:text-gray-50'>{t('profileSettings.referral.trial')}: <Highlighted>{referralStatistics.trials}</Highlighted></span>
              )}
              className='max-w-max !w-auto !h-auto'
            />
            <Tooltip
              text={t('profileSettings.referral.activeDesc')}
              tooltipNode={(
                <span className='text-gray-900 dark:text-gray-50'>{t('profileSettings.referral.active')}: <Highlighted>{referralStatistics.subscribers}</Highlighted></span>
              )}
              className='max-w-max !w-auto !h-auto'
            />
            <Tooltip
              text={t('profileSettings.referral.paidDesc')}
              tooltipNode={(
                <span className='text-gray-900 dark:text-gray-50'>{t('profileSettings.referral.paid')}: <Highlighted>US${referralStatistics.paid}</Highlighted></span>
              )}
              className='max-w-max !w-auto !h-auto'
            />
            <Tooltip
              text={t('profileSettings.referral.nextPayoutDesc')}
              tooltipNode={(
                <span className='text-gray-900 dark:text-gray-50'>{t('profileSettings.referral.nextPayout')}: <Highlighted>US${referralStatistics.nextPayout}</Highlighted></span>
              )}
              className='max-w-max !w-auto !h-auto'
            />
            <Tooltip
              text={t('profileSettings.referral.pendingDesc', {
                days: REFERRAL_PENDING_PAYOUT_DAYS,
              })}
              tooltipNode={(
                <span className='text-gray-900 dark:text-gray-50'>{t('profileSettings.referral.pending')}: <Highlighted>US${referralStatistics.pending}</Highlighted></span>
              )}
              className='max-w-max !w-auto !h-auto'
            />
          </div>
        </>
      )}
      <h3 className='flex items-center mt-2 text-lg font-bold text-gray-900 dark:text-gray-50'>
        {t('profileSettings.referral.activeReferrals')}
      </h3>
    </>
  )
}

export default memo(Referral)
