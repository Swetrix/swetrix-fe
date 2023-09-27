/* eslint-disable no-confusing-arrow */
import React, { memo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ClientOnly } from 'remix-utils'
import { Link } from '@remix-run/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import _map from 'lodash/map'
import _isNil from 'lodash/isNil'
import _findIndex from 'lodash/findIndex'
import _isEmpty from 'lodash/isEmpty'
import { Trans } from 'react-i18next'
import cx from 'clsx'

import Modal from 'ui/Modal'
import Spin from 'ui/icons/Spin'
import {
  CONTACT_EMAIL, paddleLanguageMapping, PLAN_LIMITS, CURRENCIES, BillingFrequency,
} from 'redux/constants'
import { errorsActions } from 'redux/reducers/errors'
import { alertsActions } from 'redux/reducers/alerts'
import { authActions } from 'redux/reducers/auth'
import sagaActions from 'redux/sagas/actions'
import {
  authMe, previewSubscriptionUpdate, changeSubscriptionPlan,
} from 'api'
import routes from 'routesPath'
import { IUser } from 'redux/models/IUser'
import { AppDispatch, StateType } from 'redux/store'
import Loader from 'ui/Loader'

type CurrencyCode = 'USD' | 'EUR' | 'GBP'

const getNonStandardTiers = (t: (key: string, options?: {
  [key: string]: any
}) => string, currencyCode: CurrencyCode) => ({
  free: {
    name: t('pricing.free'),
    planCode: 'free',
    priceMonthly: PLAN_LIMITS.free.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.free.price[currencyCode].yearly,
    legacy: PLAN_LIMITS.free.legacy,
    includedFeatures: [
      t('pricing.tiers.upToXVMo', { amount: PLAN_LIMITS.free.monthlyUsageLimit.toLocaleString('en-US') }),
      t('pricing.tiers.upToXWebsites', { amount: PLAN_LIMITS.free.maxProjects }),
      // t('pricing.tiers.xMoDataRetention', { amount: 3 }),
      t('pricing.tiers.xAlertsSingular', { amount: PLAN_LIMITS.free.maxAlerts }),
      t('pricing.tiers.userFlowAnalysis'),
      t('pricing.tiers.dataExports'),
      t('pricing.tiers.dataOwnership'),
      t('main.competitiveFeatures.perf'),
      t('pricing.tiers.dashboards'),
      t('pricing.tiers.reports'),
    ],
  },
  trial: {
    name: t('pricing.tiers.trial'),
    planCode: 'trial',
    priceMonthly: PLAN_LIMITS.trial.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.trial.price[currencyCode].yearly,
    legacy: PLAN_LIMITS.trial.legacy,
    includedFeatures: [
      t('pricing.tiers.evXPlanIncl', { plan: t('pricing.tiers.freelancer') }),
    ],
  },
})

const getTiers = (t: (key: string, options?: {
  [key: string]: any
}) => string, currencyCode: CurrencyCode) => [
  {
    name: t('pricing.tiers.hobby'),
    planCode: 'hobby',
    priceMonthly: PLAN_LIMITS.hobby.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.hobby.price[currencyCode].yearly,
    includedFeatures: [
      t('pricing.tiers.upToXVMo', { amount: PLAN_LIMITS.hobby.monthlyUsageLimit.toLocaleString('en-US') }),
      t('pricing.tiers.upToXWebsites', { amount: PLAN_LIMITS.hobby.maxProjects }),
      // t('pricing.tiers.xMoDataRetention', { amount: 3 }),
      t('pricing.tiers.xAlertsPlural', { amount: PLAN_LIMITS.hobby.maxAlerts }),
      t('pricing.tiers.userFlowAnalysis'),
      t('pricing.tiers.dataExports'),
      t('pricing.tiers.dataOwnership'),
      t('main.competitiveFeatures.perf'),
      t('pricing.tiers.dashboards'),
      t('pricing.tiers.reports'),
    ],
    pid: '813694', // Plan ID
    ypid: '813695', // Plan ID - Yearly billing
  },
  {
    name: t('pricing.tiers.freelancer'),
    planCode: 'freelancer',
    priceMonthly: PLAN_LIMITS.freelancer.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.freelancer.price[currencyCode].yearly,
    includedFeatures: [
      t('pricing.tiers.evXPlanIncl', { plan: t('pricing.tiers.hobby') }),
      t('pricing.tiers.xVMo', { amount: PLAN_LIMITS.freelancer.monthlyUsageLimit.toLocaleString('en-US') }),
      t('pricing.tiers.upToXWebsites', { amount: PLAN_LIMITS.freelancer.maxProjects }),
      t('pricing.tiers.xAlertsPlural', { amount: PLAN_LIMITS.freelancer.maxAlerts }),
      // t('pricing.tiers.xMoDataRetention', { amount: 12 }),
      // t('pricing.tiers.smallBusiSupport'),
    ],
    pid: 752316, // Plan ID
    ypid: 776469, // Plan ID - Yearly billing
  },
  {
    name: t('pricing.tiers.startup'),
    planCode: 'startup',
    priceMonthly: PLAN_LIMITS.startup.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.startup.price[currencyCode].yearly,
    includedFeatures: [
      t('pricing.tiers.evXPlanIncl', { plan: t('pricing.tiers.freelancer') }),
      t('pricing.tiers.xVMo', { amount: PLAN_LIMITS.startup.monthlyUsageLimit.toLocaleString('en-US') }),
      t('pricing.tiers.xAlertsPlural', { amount: PLAN_LIMITS.startup.maxAlerts }),
      // t('pricing.tiers.xMoDataRetention', { amount: 12 }),
    ],
    pid: 752317,
    ypid: 776470,
    mostPopular: true,
  },
  {
    name: t('pricing.tiers.enterprise'),
    planCode: 'enterprise',
    priceMonthly: PLAN_LIMITS.enterprise.price[currencyCode].monthly,
    priceYearly: PLAN_LIMITS.enterprise.price[currencyCode].yearly,
    includedFeatures: [
      t('pricing.tiers.evXPlanIncl', { plan: t('pricing.tiers.startup') }),
      t('pricing.tiers.xVMo', { amount: PLAN_LIMITS.enterprise.monthlyUsageLimit.toLocaleString('en-US') }),
      t('pricing.tiers.upToXWebsites', { amount: PLAN_LIMITS.enterprise.maxProjects }),
      t('pricing.tiers.xAlertsPlural', { amount: PLAN_LIMITS.enterprise.maxAlerts }),
      // t('pricing.tiers.xMoDataRetention', { amount: 24 }),
    ],
    pid: 752318,
    ypid: 776471,
  },
]

interface IPricingItem {
  tier: any
  user: IUser
  t: (key: string, options?: {
    [key: string]: any
  }) => string
  authenticated: boolean
  billingFrequency: string
  onPlanChange: (planCode: {
    planCode: string,
    name: string,
    pid: string,
    ypid: string,
  }) => void
  downgradeHandler: (item: any) => void
  downgrade: boolean
  planCodeLoading: boolean | string | null
  planCodeID: string | number
  userPlancodeID: string | number
  currencyCode: CurrencyCode
}

const PricingItem = ({
  tier, user, t, authenticated, billingFrequency, onPlanChange, downgradeHandler, downgrade,
  planCodeLoading, planCodeID, userPlancodeID, currencyCode,
}: IPricingItem) => {
  let action

  const currency = CURRENCIES[currencyCode]

  if (planCodeID > userPlancodeID) {
    action = t('pricing.upgrade')
  } else if (downgrade) {
    action = t('pricing.downgrade')
  } else if (user.billingFrequency === billingFrequency || user.planCode === 'free' || user.planCode === 'trial') {
    action = t('pricing.yourPlan')
  } else if (billingFrequency === BillingFrequency.monthly) {
    action = t('pricing.switchToMonthly')
  } else {
    action = t('pricing.switchToYearly')
  }

  return (
    <div
      key={tier.name}
      className={cx('relative border rounded-2xl shadow-sm divide-y bg-[#F5F5F5] dark:bg-slate-800/20 dark:border dark:border-slate-800 divide-gray-200 dark:divide-slate-700', {
        'border-indigo-400': user.planCode === tier.planCode,
        'border-gray-200 dark:border-gray-500': user.planCode !== tier.planCode,
      })}
    >
      {user.planCode === tier.planCode && (
        <div className='absolute inset-x-0 top-0 transform translate-y-px'>
          <div className='flex justify-center transform -translate-y-1/2'>
            <span className='inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white'>
              {t('pricing.currentPlan')}
            </span>
          </div>
        </div>
      )}
      <div className='p-6 border-none'>
        <h2 className='text-lg leading-6 font-semibold text-[#4D4D4D] dark:text-gray-50 text-center'>{tier.name}</h2>
        {tier.mostPopular && !authenticated && (
          <p className='absolute top-0 py-1.5 px-4 bg-indigo-600 dark:bg-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2'>
            {t('pricing.mostPopular')}
          </p>
        )}
        {tier.legacy && (
          <p className='absolute top-0 left-2 py-1 px-2 bg-yellow-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform translate-y-4'>
            {t('pricing.legacy')}
          </p>
        )}
        <ClientOnly fallback={<Loader />}>
          {() => (
            <p className='mt-4 text-center'>
              <span className='text-4xl font-bold text-[#4D4D4D] dark:text-gray-50'>
                {currency.symbol}
                {billingFrequency === BillingFrequency.monthly ? tier.priceMonthly : tier.priceYearly}
              </span>
              &nbsp;
              <span className='text-base font-medium text-gray-500 dark:text-gray-400'>
                /
                {t(billingFrequency === BillingFrequency.monthly ? 'pricing.perMonth' : 'pricing.perYear')}
              </span>
            </p>
          )}
        </ClientOnly>
        {authenticated ? (
          <span
            onClick={() => downgrade ? downgradeHandler(tier) : onPlanChange(tier)}
            className={cx('inline-flex items-center justify-center mt-8 w-full rounded-md py-2 text-sm font-semibold text-white text-center select-none', {
              'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 hover:dark:bg-indigo-800 cursor-pointer': planCodeLoading === null && (tier.planCode !== user.planCode || (user.billingFrequency !== billingFrequency && user.planCode !== 'free')),
              'bg-indigo-400 cursor-default': planCodeLoading !== null || (tier.planCode === user.planCode && (user.billingFrequency === billingFrequency || user.planCode === 'free' || user.planCode === 'trial')),
            })}
          >
            {planCodeLoading === tier.planCode && (
              <Spin />
            )}
            {action}
          </span>
        ) : (
          <Link
            className='mt-8 block w-full bg-indigo-600 dark:bg-indigo-700 hover:dark:bg-indigo-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700'
            to={routes.signup}
            aria-label={t('titles.signup')}
          >
            {t('common.getStarted')}
          </Link>
        )}
      </div>
      <div className='px-6 border-none'>
        <hr className='w-full mx-auto border border-gray-300 dark:border-slate-800' />
      </div>
      <div className='pt-6 pb-8 px-6 border-none'>
        <h3 className='text-xs font-medium text-gray-900 dark:text-gray-50 tracking-wide uppercase'>
          {t('pricing.whatIncl')}
        </h3>
        <ul className='mt-6 space-y-4'>
          {_map(tier.includedFeatures, (feature) => (
            <li key={feature} className='flex space-x-3'>
              <CheckIcon className='flex-shrink-0 h-5 w-5 text-green-500' aria-hidden='true' />
              <span className='text-sm text-gray-500 dark:text-gray-200'>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface IPricing {
  t: (key: string, options?: {
    [key: string]: string | number,
  }) => string,
  language: string,
  authenticated: boolean,
}

const Pricing = ({ t, language, authenticated }: IPricing) => {
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: StateType) => state.auth)
  const { theme } = useSelector((state: StateType) => state.ui.theme)
  const { paddle, metainfo } = useSelector((state: StateType) => state.ui.misc)
  const { lastEvent } = paddle
  const currencyCode = user?.tierCurrency || metainfo.code

  const [planCodeLoading, setPlanCodeLoading] = useState<string | null>(null)
  const [isNewPlanConfirmationModalOpened, setIsNewPlanConfirmationModalOpened] = useState<boolean>(false)
  const [subUpdatePreview, setSubUpdatePreview] = useState<any>(null) // object - preview itself, null - loading, false - error
  const [newPlanId, setNewPlanId] = useState<number | null>(null)
  const [isSubUpdating, setIsSubUpdating] = useState<boolean>(false)
  const [downgradeTo, setDowngradeTo] = useState<{
    planCode: string,
    name: string,
    pid: string,
    ypid: string,
  } | null>(null)
  const [showDowngradeModal, setShowDowngradeModal] = useState<boolean>(false)
  const [billingFrequency, setBillingFrequency] = useState(user?.billingFrequency || BillingFrequency.monthly)
  const tiers = getTiers(t, currencyCode)
  const nonStandardTiers: {
    [key: string]: {
      [key: string]: any,
    },
  } = getNonStandardTiers(t, currencyCode)
  const isNonStandardTier = authenticated && !_isEmpty(nonStandardTiers[user.planCode])

  useEffect(() => {
    const lastEventHandler = async (data: {
      event: string,
    }) => {
      if (_isNil(data)) {
        return
      }

      if (data.event === 'Checkout.Complete') {
        // giving some time to the API to process tier upgrate via Paddle webhook
        setTimeout(async () => {
          try {
            const me = await authMe()

            dispatch(authActions.loginSuccessful(me))
            dispatch(authActions.finishLoading())
          } catch (e) {
            dispatch(authActions.logout())
            dispatch(sagaActions.logout(false, false))
          }

          dispatch(alertsActions.accountUpdated({
            message: t('apiNotifications.subscriptionUpdated'),
          }))
        }, 3000)
        setPlanCodeLoading(null)
        setDowngradeTo(null)
      } else if (data.event === 'Checkout.Close') {
        setPlanCodeLoading(null)
        setDowngradeTo(null)
      }
    }

    lastEventHandler(lastEvent)
  }, [lastEvent, dispatch, t])

  const loadSubUpdatePreview = async (planId: number) => {
    setIsNewPlanConfirmationModalOpened(true)
    try {
      const preview = await previewSubscriptionUpdate(planId)
      setSubUpdatePreview(preview)
    } catch (reason) {
      console.error('[ERROR] An error occured while loading subscription update pricing preview:', reason)
      dispatch(errorsActions.genericError({
        message: 'An error occured while loading subscription update pricing preview',
      }))
      setSubUpdatePreview(false)
    }
  }

  const onPlanChange = async (tier: {
    planCode: string,
    name: string,
    pid: string,
    ypid: string,
  }) => {
    if (planCodeLoading === null && (user.planCode !== tier.planCode || (user.billingFrequency !== billingFrequency && user.planCode !== 'free' && user.planCode !== 'trial'))) {
      if (user.subID) {
        const planId = Number(billingFrequency === BillingFrequency.monthly ? tier.pid : tier.ypid)
        setNewPlanId(planId)
        await loadSubUpdatePreview(planId)
        return
      }

      setPlanCodeLoading(tier.planCode)

      // @ts-ignore
      if (!window.Paddle) {
        dispatch(errorsActions.genericError({
          message: 'Payment script has not yet loaded! Please, try again.',
        }))
        setPlanCodeLoading(null)
        return
      }

      // @ts-ignore
      window.Paddle.Checkout.open({
        product: billingFrequency === BillingFrequency.monthly ? tier.pid : tier.ypid,
        email: user.email,
        passthrough: JSON.stringify({
          uid: user.id,
        }),
        locale: paddleLanguageMapping[language] || language,
        title: tier.name,
        displayModeTheme: theme,
        country: metainfo.country,
      })
    }
  }

  const closeUpdateModal = (force?: boolean) => {
    if (isSubUpdating && !force) {
      return
    }

    setIsNewPlanConfirmationModalOpened(false)
    setSubUpdatePreview(null)
    setNewPlanId(null)
    setIsSubUpdating(false)
  }

  const updateSubscription = async () => {
    setIsSubUpdating(true)

    try {
      await changeSubscriptionPlan(newPlanId as number)

      try {
        const me = await authMe()

        dispatch(authActions.loginSuccessful(me))
        dispatch(authActions.finishLoading())
      } catch (e) {
        dispatch(authActions.logout())
        dispatch(sagaActions.logout(false, false))
      }

      dispatch(alertsActions.accountUpdated({
        message: t('apiNotifications.subscriptionUpdated'),
      }))
      closeUpdateModal(true)
    } catch (reason) {
      console.error('[ERROR] An error occured while updating subscription:', reason)
      dispatch(errorsActions.genericError({
        message: 'An error occured while updating subscription',
      }))
      closeUpdateModal(true)
    }
  }

  const downgradeHandler = (tier: {
    planCode: string,
    name: string,
    pid: string,
    ypid: string,
  }) => {
    if (planCodeLoading === null && user.planCode !== tier.planCode) {
      setDowngradeTo(tier)
      setShowDowngradeModal(true)
    }
  }

  const userPlancodeID = _findIndex(tiers, (el) => el.planCode === user.planCode)

  return (
    <>
      <div id='pricing' className={cx({ 'bg-white dark:bg-slate-900/75': !authenticated })}>
        <div className={cx('w-11/12 max-w-7xl mx-auto whitespace-pre-line', { 'px-4 sm:px-6 lg:px-8 py-24': !authenticated })}>
          <div className='sm:flex sm:flex-col sm:align-center'>
            {!authenticated && (
              <>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-center'>
                  {t('pricing.title')}
                </h1>
                <p className='mt-5 text-xl text-gray-500 dark:text-gray-200 sm:text-center'>
                  {t('pricing.adv')}
                </p>
              </>
            )}
            <div className='relative self-center mt-6 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 flex sm:mt-8 xs:flex-row flex-col'>
              <button
                type='button'
                onClick={() => setBillingFrequency(BillingFrequency.monthly)}
                className={cx('relative xs:w-1/2 rounded-md shadow-sm py-2 text-sm font-medium whitespace-nowrap sm:w-auto sm:px-8', {
                  'bg-white border-gray-200 text-gray-900 dark:bg-slate-900 dark:border-gray-800 dark:text-gray-50': billingFrequency === BillingFrequency.monthly,
                  'text-gray-700 dark:text-gray-100': billingFrequency === BillingFrequency.yearly,
                })}
              >
                {t('pricing.monthlyBilling')}
              </button>
              <button
                type='button'
                onClick={() => setBillingFrequency(BillingFrequency.yearly)}
                className={cx('ml-0.5 relative xs:w-1/2 border border-transparent rounded-md py-2 text-sm font-medium whitespace-nowrap sm:w-auto sm:px-8', {
                  'text-gray-700 dark:text-gray-100': billingFrequency === BillingFrequency.monthly,
                  'bg-white border-gray-200 text-gray-900 dark:bg-slate-900 dark:border-gray-800 dark:text-gray-50': billingFrequency === BillingFrequency.yearly,
                })}
              >
                {t('pricing.yearlyBilling')}
              </button>
            </div>
          </div>
          <div className='mt-6 space-y-4 sm:mt-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4'>
            {isNonStandardTier && (
              <PricingItem
                key={user.planCode}
                tier={nonStandardTiers[user.planCode]}
                user={user}
                t={t}
                billingFrequency={billingFrequency}
                onPlanChange={onPlanChange}
                downgrade={false}
                downgradeHandler={downgradeHandler}
                planCodeLoading={planCodeLoading}
                authenticated={authenticated}
                planCodeID={user.planCode}
                userPlancodeID={user.planCode}
                currencyCode={currencyCode}
              />
            )}
            {_map(tiers, (tier) => {
              const planCodeID = _findIndex(tiers, (el) => el.planCode === tier.planCode)
              const downgrade = planCodeID < userPlancodeID

              return (
                <PricingItem
                  key={tier.planCode}
                  tier={tier}
                  user={user}
                  t={t}
                  billingFrequency={billingFrequency}
                  onPlanChange={onPlanChange}
                  downgrade={downgrade}
                  downgradeHandler={downgradeHandler}
                  planCodeLoading={planCodeLoading}
                  authenticated={authenticated}
                  planCodeID={planCodeID}
                  userPlancodeID={userPlancodeID}
                  currencyCode={currencyCode}
                />
              )
            })}
          </div>
        </div>
        <div className='checkout-container' id='checkout-container' />
      </div>
      <Modal
        onClose={() => {
          setDowngradeTo(null)
          setShowDowngradeModal(false)
        }}
        onSubmit={() => {
          setShowDowngradeModal(false)
          if (downgradeTo) {
            onPlanChange(downgradeTo)
          }
        }}
        submitText={t('common.yes')}
        closeText={t('common.no')}
        title={t('pricing.downgradeTitle')}
        type='warning'
        message={(
          <Trans
            // @ts-ignore
            t={t}
            i18nKey='pricing.downgradeDesc'
            values={{
              email: CONTACT_EMAIL,
            }}
          />
        )}
        isOpened={showDowngradeModal}
      />
      <Modal
        onClose={closeUpdateModal}
        onSubmit={updateSubscription}
        submitText={t('common.confirm')}
        closeText={t('common.goBack')}
        title={t('billing.confirmNewPlan')}
        submitType='regular'
        type='info'
        isLoading={isSubUpdating}
        message={(
          <>
            {subUpdatePreview === null && (
              <Loader />
            )}
            {subUpdatePreview === false && (
              <p className='whitespace-pre-line'>{t('billing.previewLoadingError')}</p>
            )}
            {subUpdatePreview && (
              <div>
                <h2 className='text-base font-bold'>
                  {t('billing.dueNow')}
                </h2>
                <p className='text-sm'>
                  {t('billing.dueNowDescription')}
                </p>
                <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-2'>
                  <table className='min-w-full divide-y divide-gray-300 200 dark:divide-gray-500'>
                    <thead className='bg-gray-50 dark:bg-slate-800'>
                      <tr>
                        <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50 sm:pl-6'>
                          {t('common.amount')}
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50'>
                          {t('common.date')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-slate-800'>
                      <tr>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-50 sm:pl-6'>
                          {`${subUpdatePreview.immediatePayment.symbol}${subUpdatePreview.immediatePayment.amount}`}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-50'>
                          {language === 'en'
                            ? dayjs(subUpdatePreview.immediatePayment.date).locale(language).format('MMMM D, YYYY')
                            : dayjs(subUpdatePreview.immediatePayment.date).locale(language).format('D MMMM, YYYY')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {subUpdatePreview.immediatePayment.amount < 0 && (
                  <p className='mt-2 italic'>
                    {t('billing.negativePayment', {
                      currency: subUpdatePreview.immediatePayment.symbol,
                      dueNowAmount: -subUpdatePreview.immediatePayment.amount,
                      dueNowDate: language === 'en' ? dayjs(subUpdatePreview.immediatePayment.date).locale(language).format('MMMM D, YYYY') : dayjs(subUpdatePreview.immediatePayment.date).locale(language).format('D MMMM, YYYY'),
                      nextPaymentAmount: subUpdatePreview.nextPayment.amount,
                    })}
                  </p>
                )}
                <h2 className='text-base font-bold mt-5'>
                  {t('billing.nextPayment')}
                </h2>
                <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-2'>
                  <table className='min-w-full divide-y divide-gray-300 200 dark:divide-gray-500'>
                    <thead className='bg-gray-50 dark:bg-slate-800'>
                      <tr>
                        <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-50 sm:pl-6'>
                          {t('common.amount')}
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50'>
                          {t('common.date')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-slate-800'>
                      <tr>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-50 sm:pl-6'>
                          {`${subUpdatePreview.nextPayment.symbol}${subUpdatePreview.nextPayment.amount}`}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-50'>
                          {language === 'en'
                            ? dayjs(subUpdatePreview.nextPayment.date).locale(language).format('MMMM D, YYYY')
                            : dayjs(subUpdatePreview.nextPayment.date).locale(language).format('D MMMM, YYYY')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        isOpened={isNewPlanConfirmationModalOpened}
      />
    </>
  )
}

export default memo(Pricing)
