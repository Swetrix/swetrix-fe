/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo, useState } from 'react'
import cx from 'clsx'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import _map from 'lodash/map'

import routes from 'routes'
// import { nFormatter } from 'utils/generic'
import { CONTACT_EMAIL } from 'redux/constants'
import Title from 'components/Title'
import { withAuthentication, auth } from '../../hoc/protected'
import SignUp from '../Auth/Signup/BasicSignup'
import Pricing from './Pricing'

import './NewMainPage.css'

const LIVE_DEMO_URL = '/projects/STEzHcB1rALV'

const FAQs = ({ t }) => (
  <div id='faqs' className='bg-gray-50 dark:bg-gray-800'>
    <div className='w-11/12 mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8'>
      <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
        <div>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-50'>
            {t('main.faq.title')}
          </h2>
          <p className='mt-4 text-lg text-gray-500 dark:text-gray-200'>
            <Trans
              t={t}
              i18nKey='main.custSupport'
              components={{
                mail: <a href={`mailto:${CONTACT_EMAIL}`} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400' />,
              }}
            />
          </p>
        </div>
        <div className='mt-12 lg:mt-0 lg:col-span-2'>
          <dl className='space-y-12'>
            {_map(t('main.faq.list', { returnObjects: true }), (faq) => (
              <div key={faq.question}>
                <dt className='text-lg leading-6 font-medium text-gray-900 dark:text-gray-50'>{faq.question}</dt>
                <dd className='mt-2 text-base text-gray-500 dark:text-gray-300 whitespace-pre-line'>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </div>
)

const Features = ({ t }) => (
  <div className='bg-white dark:bg-gray-800'>
    <div className='w-11/12 mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
      <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center'>
        {t('main.whyUs')}
      </h2>
      <div className='mt-12'>
        <dl className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3'>
          {_map(t('main.features', { returnObjects: true }), (feature) => (
            <div key={feature.name}>
              <dt className='text-lg leading-6 font-semibold text-gray-900 dark:text-gray-50'>{feature.name}</dt>
              <dd className='mt-2 text-base text-gray-500 dark:text-gray-300'>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
)

const Main = () => {
  const { t, i18n: { language } } = useTranslation('common')
  const { theme } = useSelector(state => state.ui.theme)
  // const stats = useSelector(state => state.ui.misc.stats)
  const [liveDemoHover, setLiveDemoHover] = useState(false)

  return (
    <Title title='Privacy Respecting Web Analytics Platform'>
      <div className='relative flex justify-center items-center bg-gray-900 py-2 px-2'>
        <a href='https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi' target='_blank' rel='noreferrer noopener' className='text-white border-gray-900 border-b-2 hover:border-white text-center'>
          {t('main.ukrSupport')}
        </a>
        <ExternalLinkIcon className='h-4 w-4 text-white ml-1 hidden md:block' />
      </div>
      <div className='relative bg-gray-800'>
        {/* <img className='absolute bottom-0 left-0 top-0 translate-x-0 mb-0 text-gray-700 elipse-main-page' src='/assets/Elipse.png' alt='elipse-main-page' /> */}
        <div
          className='relative pt-24 pb-16 sm:pb-24 main_section'
          style={{
            backgroundPositionX: 'right',
            backgroundRepeat: 'round',
            backgroundImage: 'url(\'/assets/Elipse.png\')',
          }}
        >
          <main className='mt-8'>
            <div className='flex items-center'>
              <div className='flex flex-row items-start content-between ml-[70px]'>
                <div className='max-w-3xl pb-10 lg:mt-0 mx-auto text-center lg:text-left lg:pr-14 relative'>
                  <h1 className='text-4xl tracking-tight font-extrabold text-white sm:leading-none lg:text-5xl xl:text-6xl'>
                    <span className='from-indigo-600 text-transparent bg-clip-text bg-gradient-to-r to-indigo-400'>Ultimate open-source </span>
                    <br />
                    <span className='from-indigo-600 text-transparent bg-clip-text bg-gradient-to-r to-indigo-400'>analytics</span>
                    {' '}
                    to satisfy all your needs.
                  </h1>
                  <p className='mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-[1rem]'>
                    Swetrix brings an advanced and customisable analytics service
                    <br />
                    for your web applications.
                    <br />
                    {t('main.trackEveryMetric')}
                  </p>
                </div>
                <div className=''>
                  <img className='absolute right-0 bottom-6' src='/assets/mainSectionDemo.png' alt='demo-main-section' />
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* form singup */}
        {/* <div className='mt-16 sm:mt-24 lg:mt-0 lg:col-span-6'>
                  <div className='bg-white dark:bg-gray-700 sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden'>
                    <div className='px-4 py-8 sm:px-10'>
                      <p className='text-lg text-gray-900 dark:text-white text-center'>
                        {t('main.signup')}
                      </p>
                      <div className='mt-6'>
                        <SignUp />
                      </div>
                    </div>
                    <div className='px-4 py-6 bg-gray-50 dark:bg-gray-700 border-t-2 border-gray-200 dark:border-gray-500 sm:px-10'>
                      <p className='text-xs leading-5 text-gray-500 dark:text-gray-100'>
                        <Trans
                          t={t}
                          i18nKey='main.signupTerms'
                          components={{
                            tos: <Link to={routes.terms} className='font-medium text-gray-900 dark:text-gray-300 hover:underline' />,
                            pp: <Link to={routes.privacy} className='font-medium text-gray-900 dark:text-gray-300 hover:underline' />,
                          }}
                        />
                      </p>
                    </div>
                  </div>
                </div> */}
        {/* live demo */}
        {/* <div className='relative'>
          <div className='absolute inset-0 flex flex-col' aria-hidden='true'>
            <div className='flex-1' />
            <div className='flex-1 w-full bg-white dark:bg-gray-800' />
          </div>
          <div className='w-11/12 mx-auto relative' onMouseEnter={() => setLiveDemoHover(true)} onMouseLeave={() => setLiveDemoHover(false)}>
            {theme === 'dark' ? (
              <img
                className={cx('relative rounded-md md:rounded-lg shadow-lg w-full transition-all', {
                  'brightness-75': liveDemoHover,
                })}
                src='/assets/screenshot_dark.png'
                alt=''
              />
            ) : (
              <img
                className={cx('relative rounded-md md:rounded-lg shadow-lg w-full transition-all', {
                  'brightness-75': liveDemoHover,
                })}
                src='/assets/screenshot_light.png'
                alt=''
              />
            )}
            {liveDemoHover && (
              <a
                href={LIVE_DEMO_URL}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center whitespace-nowrap px-3 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700'
                target='_blank'
                rel='noreferrer noopener'
              >
                {t('common.liveDemo')}
              </a>
            )}
          </div>
        </div> */}

        <Features t={t} />

        {/* <div className='py-6 overflow-hidden bg-gray-50 dark:bg-gray-700'>
          <div className='w-11/12 container mx-auto'>
            <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center'>
              {t('main.ourStats')}
            </h2>
            <p className='max-w-3xl mx-auto mt-3 text-xl text-center text-gray-500 dark:text-gray-200 sm:mt-4'>
              {t('main.statsDesc')}
            </p>
            <div className='pb-12 mt-10 bg-gray-50 dark:bg-gray-700 sm:pb-16'>
              <div className='relative w-full'>
                <div className='mx-auto'>
                  <dl className='bg-gray-50 dark:bg-gray-700 rounded-lg sm:grid sm:grid-cols-3'>
                    <div className='flex flex-col p-6 text-center border-b border-gray-100 sm:border-0 sm:border-r'>
                      <dt className='order-2 mt-2 text-lg font-medium text-gray-500 dark:text-gray-100 leading-6'>
                        {t('main.users')}
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-indigo-600 dark:text-indigo-500'>
                        {Number(stats.users).toLocaleString()}
                      </dd>
                    </div>
                    <div className='flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r'>
                      <dt className='order-2 mt-2 text-lg font-medium text-gray-500 dark:text-gray-100 leading-6'>
                        {t('main.websites')}
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-indigo-600 dark:text-indigo-500'>
                        {Number(stats.projects).toLocaleString()}
                      </dd>
                    </div>
                    <div className='flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-l'>
                      <dt className='order-2 mt-2 text-lg font-medium text-gray-500 dark:text-gray-100 leading-6'>
                        {t('main.pageviews')}
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-indigo-600 dark:text-indigo-500'>
                        {nFormatter(Number(stats.pageviews), 1)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className='bg-indigo-600 dark:bg-indigo-800'>
          <div className='w-11/12 mx-auto pb-16 pt-12 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between'>
            <h2 className='text-3xl font-extrabold tracking-tight'>
              <span className='block text-white'>
                {t('main.description')}
              </span>
              <span className='block text-gray-300 dark:text-gray-200'>
                {t('main.lookAtDocs')}
              </span>
            </h2>
            <div className='mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5'>
              <Link
                to={LIVE_DEMO_URL}
                className='flex items-center justify-center whitespace-nowrap px-3 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-100 dark:hover:bg-indigo-200'
              >
                {t('common.liveDemo')}
              </Link>
              <Link
                to={routes.docs}
                className='flex items-center justify-center whitespace-nowrap px-3 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-100 dark:hover:bg-indigo-200'
              >
                {t('common.docs')}
              </Link>
            </div>
          </div>
        </div>
        <Pricing t={t} language={language} />
        <FAQs t={t} />

        <div className='bg-white dark:bg-gray-750'>
          <div className='w-11/12 mx-auto pb-16 pt-12 px-4 sm:px-6 lg:w-11/12 lg:px-8 lg:flex lg:items-center lg:justify-between'>
            <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50'>
              <span className='block'>
                {t('main.readyToStart')}
              </span>
              <span className='block bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500 bg-clip-text text-transparent'>
                {t('main.exploreService')}
              </span>
            </h2>
            <div className='mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5'>
              <Link
                to={routes.features}
                className='flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white hover:from-purple-700 hover:to-indigo-700'
              >
                {t('common.features')}
              </Link>
              <Link
                to={routes.signup}
                className='flex items-center justify-center whitespace-nowrap px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
              >
                {t('common.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Title>
  )
}

export default memo(withAuthentication(Main, auth.notAuthenticated))
