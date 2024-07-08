import React from 'react'
import { Link } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'

import { useTranslation, Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { StateType } from 'redux/store'
import { BOOK_A_CALL_URL, isBrowser, LIVE_DEMO_URL } from 'redux/constants'
import routesPath from 'routesPath'

import { ArrowSmallRightIcon, ArrowTopRightOnSquareIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import Header from 'components/Header'
import { getAccessToken } from 'utils/accessToken'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'

interface IMarketers {
  ssrTheme: 'dark' | 'light'
  ssrAuthenticated: boolean
}

const Marketers: React.FC<IMarketers> = ({ ssrTheme, ssrAuthenticated }): JSX.Element => {
  const { t } = useTranslation('common')
  const reduxTheme = useSelector((state: StateType) => state.ui.theme.theme)
  const { lastBlogPost } = useSelector((state: StateType) => state.ui.misc)
  const accessToken = getAccessToken()
  const { authenticated: reduxAuthenticated, loading } = useSelector((state: StateType) => state.auth)
  const authenticated = isBrowser ? (loading ? !!accessToken : reduxAuthenticated) : ssrAuthenticated
  const theme = isBrowser ? reduxTheme : ssrTheme

  return (
    <main className='bg-white dark:bg-slate-900'>
      <div className='relative isolate overflow-x-clip'>
        <svg
          className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-white/10'
          aria-hidden='true'
        >
          <defs>
            <pattern id='rect-pattern' width={200} height={200} x='50%' y={-1} patternUnits='userSpaceOnUse'>
              <path d='M.5 200V.5H200' fill='none' />
            </pattern>
          </defs>
          <svg x='50%' y={-1} className='overflow-visible fill-white dark:fill-gray-800/20'>
            <path
              d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z'
              strokeWidth={0}
            />
          </svg>
          <rect width='100%' height='100%' strokeWidth={0} fill='url(#rect-pattern)' />
        </svg>
        <div
          className='absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]'
          aria-hidden='true'
        >
          <div
            className='aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20'
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <Header ssrTheme={ssrTheme} authenticated={authenticated} transparent />
        <div className='flex items-center justify-center px-2 py-2'>
          <a
            href='https://u24.gov.ua/'
            target='_blank'
            rel='noreferrer noopener'
            className='border-b-2 border-transparent text-center text-slate-900 hover:border-slate-900 dark:text-white dark:hover:border-white'
          >
            {t('main.ukrSupport')}
          </a>
          <ArrowTopRightOnSquareIcon className='ml-1 hidden h-4 w-4 text-slate-800 dark:text-white md:block' />
        </div>
        <div className='relative mx-auto min-h-[740px] pb-5 pt-10 sm:px-3 lg:px-6 lg:pt-24 xl:px-8'>
          <div className='relative z-20 flex flex-col  content-between justify-center'>
            <div className='relative mx-auto flex flex-col px-4 text-left'>
              <h1 className='mx-auto max-w-4xl text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:text-5xl sm:leading-none md:text-5xl lg:text-5xl xl:text-6xl xl:leading-[110%]'>
                <Trans
                  // @ts-ignore
                  t={t}
                  i18nKey='marketers.slogan'
                  components={{
                    span: (
                      <span className='bg-gradient-to-r  from-indigo-700 to-pink-700 bg-clip-text text-transparent dark:from-indigo-600 dark:to-indigo-400' />
                    ),
                  }}
                />
              </h1>
              <div className='mx-auto mb-2 mt-2 flex items-center overflow-hidden sm:text-xl lg:text-lg xl:text-lg'>
                <p className='rounded-full bg-indigo-500/10 px-3 py-1 text-center text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-400'>
                  Latest news
                </p>
                {_isEmpty(lastBlogPost) ? (
                  <div className='ml-1 h-6 w-full max-w-xs animate-pulse rounded-md bg-slate-300 dark:bg-slate-700' />
                ) : (
                  <ClientOnly
                    fallback={
                      <div className='ml-1 h-6 w-full max-w-xs animate-pulse rounded-md bg-slate-300 dark:bg-slate-700' />
                    }
                  >
                    {() => (
                      <Link
                        className='ml-1 inline-flex items-center space-x-1 text-sm font-semibold leading-6 text-slate-700 hover:underline dark:text-slate-300'
                        to={`blog/${lastBlogPost.handle}`}
                      >
                        <small className='text-sm'>{lastBlogPost.title}</small>
                        <ChevronRightIcon className='h-4 w-4 text-slate-500' aria-hidden='true' />
                      </Link>
                    )}
                  </ClientOnly>
                )}
              </div>
              <p className='mx-auto max-w-6xl text-center text-base leading-8 text-slate-900 dark:text-slate-300 sm:text-xl lg:text-lg xl:text-lg'>
                {t('marketers.description')}
                <br />
                {t('main.trackEveryMetric')}
              </p>
              <div className='mt-10 flex flex-col items-center justify-center sm:flex-row'>
                <Link
                  to={routesPath.signup}
                  className='flex h-12 w-full items-center justify-center rounded-md bg-slate-900 text-white shadow-sm ring-1 ring-slate-900 transition-all !duration-300 hover:bg-slate-700 dark:bg-indigo-700 dark:ring-indigo-700 dark:hover:bg-indigo-600 sm:mr-6 sm:max-w-[210px]'
                  aria-label={t('titles.signup')}
                >
                  <span className='mr-1 text-base font-semibold'>{t('common.getStarted')}</span>
                  <ArrowSmallRightIcon className='mt-[1px] h-4 w-5' />
                </Link>
                <a
                  href={LIVE_DEMO_URL}
                  className='mt-2 flex h-12 w-full items-center justify-center rounded-md bg-transparent text-slate-900 shadow-sm ring-1 ring-slate-900 transition-all !duration-300 hover:bg-slate-200 dark:text-white dark:ring-white/20 dark:hover:bg-gray-800 sm:mt-0 sm:max-w-[210px]'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${t('common.liveDemo')} (opens in a new tab)`}
                >
                  <span className='text-base font-semibold'>{t('common.liveDemo')}</span>
                </a>
              </div>
              <a
                href={BOOK_A_CALL_URL}
                className='mx-auto mt-8 flex max-w-max items-center border-0 font-bold text-slate-900 hover:underline dark:text-gray-100'
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${t('common.bookADemo')} (opens in a new tab)`}
              >
                <span className='text-base font-semibold'>{t('common.bookADemo')}</span>
                <ArrowSmallRightIcon className='mt-[1px] h-4 w-5' />
              </a>
            </div>
          </div>
          <div className='relative z-20 mx-auto mt-10 block max-w-[1400px] px-4 md:px-0'>
            <picture>
              <source
                srcSet={theme === 'dark' ? '/assets/screenshot_dark.webp' : '/assets/screenshot_light.webp'}
                type='image/webp'
              />
              <img
                src={theme === 'dark' ? '/assets/screenshot_dark.png' : '/assets/screenshot_light.png'}
                className='relative w-full rounded-xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10'
                width='100%'
                height='auto'
                alt='Swetrix Analytics dashboard'
              />
            </picture>
          </div>
        </div>
      </div>

      <div className='mx-auto mt-[50px] max-w-5xl  px-[20px]'>
        {_map(
          t('marketers.allTexts', { returnObjects: true }),
          (
            item: {
              name: string
              desc: string[]
            },
          ) => (
            <div className=' dark:text-white text-slate-900 mb-10'>
              <h2 className='mb-5 text-[22px] md:text-[32px] font-extrabold'>{item.name}</h2>
              {_map(item.desc, (descText, indexDesc) => (
                <p className='mb-[20px] text-[16px] md:text-[22px]'>
                  <Trans
                    t={t}
                    components={{
                      span: (
                        <span className='bg-gradient-to-r font-bold to-90% dark:to-50%  from-indigo-700 to-pink-900 bg-clip-text text-transparent dark:from-indigo-600 dark:to-indigo-400' />
                      ),
                    }}
                  >
                    {descText}
                  </Trans>
              </p>
              ))}
            </div>
          ),
        )}
        <div className='mt-10 flex flex-col items-center justify-center sm:flex-row'>
          <Link
            to={routesPath.signup}
            className='flex h-12 w-full items-center justify-center rounded-md bg-slate-900 text-white shadow-sm ring-1 ring-slate-900 transition-all !duration-300 hover:bg-slate-700 dark:bg-indigo-700 dark:ring-indigo-700 dark:hover:bg-indigo-600 sm:mr-6 sm:max-w-[210px]'
            aria-label={t('titles.signup')}
          >
            <span className='mr-1 text-base font-semibold'>{t('common.getStarted')}</span>
            <ArrowSmallRightIcon className='mt-[1px] h-4 w-5' />
          </Link>
          <a
            href={LIVE_DEMO_URL}
            className='mt-2 flex h-12 w-full items-center justify-center rounded-md bg-transparent text-slate-900 shadow-sm ring-1 ring-slate-900 transition-all !duration-300 hover:bg-slate-200 dark:text-white dark:ring-white/20 dark:hover:bg-gray-800 sm:mt-0 sm:max-w-[210px]'
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${t('common.liveDemo')} (opens in a new tab)`}
          >
            <span className='text-base font-semibold'>{t('common.liveDemo')}</span>
          </a>
        </div>
      </div>

      <div className='overflow-hidden'>
        <div className='relative isolate mx-auto w-full pt-10'>
          <svg
            className='absolute inset-0 -z-10 hidden h-full w-full rotate-180 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] dark:stroke-white/10 sm:block'
            aria-hidden='true'
          >
            <defs>
              <pattern id='rect-pattern-2' width={200} height={200} x='50%' y={0} patternUnits='userSpaceOnUse'>
                <path d='M.5 200V.5H200' fill='none' />
              </pattern>
            </defs>
            <svg x='50%' y={0} className='overflow-visible fill-gray-50 dark:fill-slate-800/30'>
              <path
                d='M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z'
                strokeWidth={0}
              />
            </svg>
            <rect width='100%' height='100%' strokeWidth={0} fill='url(#rect-pattern-2)' />
          </svg>
          <section className='relative z-20 mx-auto max-w-5xl px-3'>
            <h2 className='mx-auto mt-20 w-full max-w-5xl text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:text-5xl'>
              Our communication strategies
            </h2>
            <div className=' flex flex-wrap items-start justify-center justify-items-center gap-10 pb-36 pt-10 text-slate-900 dark:text-white'>
              {_map(
                // @ts-expect-error
                t('marketers.mFeatures', { returnObjects: true }),
                (
                  item: {
                    name: string
                    desc: string[]
                  },
                  index: number,
                ) => (
                  <div
                    key={item.name}
                    className='w-full max-w-[410px] rounded-[20px] bg-transparent p-[20px] shadow md:h-[320px] dark:shadow-white/10'
                  >
                    <div className='mb-5 flex items-center'>
                      <h2 className='text-xl font-semibold md:text-2xl'>{item.name}</h2>
                    </div>
                    {_map(item.desc, (descText) => (
                      <div className='mb-4 flex items-center justify-start'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-4 min-w-[16px] md:size-6 md:min-w-[24px]'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                          />
                        </svg>
                        <p className='ml-5 text-[16px] text-slate-700 dark:text-gray-300 md:text-[18px]'>{descText}</p>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </section>
        </div>
      </div>
      <div className='mx-auto max-w-[1440px]'></div>
    </main>
  )
}

export default Marketers