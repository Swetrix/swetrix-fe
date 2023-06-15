/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Link } from '@remix-run/react'

import {
  SWETRIX_VS_GOOGLE, DOCS_URL, CAPTCHA_URL, DOCS_CAPTCHA_URL,
} from 'redux/constants'
import routes from 'routesPath'

const INTEGRATIONS_LINK = `${routes.user_settings}#integrations`

// Date format: YYYY-MM-DD
const changelog = [
  {
    date: '2023-05-29',
    changes: [
      'Added password protected Projects functionality: now you can set a password on your Dashboard and share it with other people, only those who know the password will be able to access it.',
    ],
  },
  {
    date: '2023-05-28',
    changes: [
      'Added an indicator that shows how many live visitors your Project has at the moment on the browser tab.',
      'Updated Swetrix logo.',
      'Hidden the "Hi! How can we help?" chat widget on all pages except the Contact page (yeah, it was a terrible idea to display it on ALL of the pages).',
    ],
  },
  {
    date: '2023-05-27',
    changes: [
      'Added Plan usage section to the Billing page.',
      'Added currency localisation: now you can pay for your plan with GBP (if you\'re located in the UK) or EUR (if you\'re located in Eurozone), for all other countries the default currency is still the US Dollar.',
    ],
  },
  {
    date: '2023-05-15',
    changes: [
      'Fixed timezone related issues.',
      'Dropped support for weekly timebucket - it\'s a pain to support it across multiple timezones, but we may add it back in the future.',
      'Fix a bug when filters might not be applied to the chart when reloading the page.',
    ],
  },
  {
    date: '2023-05-08',
    changes: [
      'Added an ability to compare statistics over time periods - now you can compare the current period with the previous one, or select a custom date range to compare.',
      <>
        Swetrix is now an Open Startup, we
        {' '}
        <Link to={routes.open} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'>
          publish
        </Link>
        our finance and technical metrics.
      </>,
      'Refactored the statistics API: now the Dashboard loads at least 2 times faster and can easily handle dozens of millions of events.',
    ],
  },
  {
    date: '2023-04-27',
    changes: [
      'Added user flow feature. By using this functionality you can track user interactions and navigation patterns throughout your application, providing valuable insights for optimising user experience and engagement. To track user flow, you have to upgrade Swetrix NPM library to the version v2.2.1 or higher.',
      'Fully redesigned the Dashboard page, now your projects are listed as cards with a preview of the most important metrics.',
      'Updated the Project View screen to be more optimised for larger screens.',
      'Slightly improved the Dark theme throughout the application.',
    ],
  },
  {
    date: '2023-04-22',
    changes: [
      'Added an ability to partially delete project related analytics data.',
    ],
  },
  {
    date: '2023-04-20',
    changes: [
      'Added sorting functinoality to the Custom events panel.',
    ],
  },
  {
    date: '2023-04-18',
    changes: [
      'Added pagination for Custom events panel in Dashboard.',
    ],
  },
  {
    date: '2023-04-17',
    changes: [
      'Added Github SSO support.',
    ],
  },
  {
    date: '2023-04-16',
    changes: [
      'Added OAuth SSO: now you can sign in or register to Swetrix using your Google account or link a Google account to your existing Swetrix account to ease the sign in process. We will add other SSO providers soon :)',
    ],
  },
  {
    date: '2023-04-13',
    changes: [
      'Added an ability to view custom events on chart.',
    ],
  },
  {
    date: '2023-04-12',
    changes: [
      'Fixed an issue when the selected time bucket or period was not remembered and used after page reload.',
    ],
  },
  {
    date: '2023-04-09',
    changes: [
      'Added an ability to transfer a project from one account to another.',
      'Fixed a bug when the app was crashing due to \'ChunkLoadError: Loading chunk N failed\' error. Now in case of such error the app will reload the page automatically for one time.',
      'Fixed broken alignment of the action buttons in the dashboard.',
    ],
  },
  {
    date: '2023-04-06',
    changes: [
      'utm_* parameters in the dashboard are now displayed as decoded URL values (i.e. %20 is replaced with a space, %3D is replaced with an equal sign, etc.).',
      'Fully rewritten the frontend part of Swetrix to TypeScript to improve stability and code quality.',
      'Fixed some minor bugs related to live visitors counter and the CAPTCHA configuration page.',
      'Fixed spacing between action buttons on Dashboard on mobile layouts.',
    ],
  },
  {
    date: '2023-03-20',
    changes: [
      <>
        Introducing a new service:
        {' '}
        <a
          href={CAPTCHA_URL}
          className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'
          target='_blank'
          rel='noopener noreferrer'
        >
          Swetrix CAPTCHA
        </a>
        .
        This is a privacy-focused and fully opensource CAPTCHA service that you can use on your website to protect it from bots.
        {' '}
        Read more about it in our
        {' '}
        <a
          href={DOCS_CAPTCHA_URL}
          className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'
          target='_blank'
          rel='noopener noreferrer'
        >
          documentation page
        </a>
        .
      </>,
    ],
  },
  {
    date: '2023-03-18',
    changes: [
      'Added new email report frequency: quarterly.',
      'Added project email reports subscription to multiple email addresses.',
    ],
  },
  {
    date: '2023-03-11',
    changes: [
      'Redesigned Dashboard page panel pages layout (now it\'s more user friendly, the total count of items and pages are displayed as well).',
    ],
  },
  {
    date: '2023-02-26',
    changes: [
      'Added a switch between line and bar chart on the dashboard page.',
    ],
  },
  {
    date: '2023-02-18',
    changes: [
      'Added AI forecasting functionality.',
      'Migrated to a paid-only model with a free trial. Everyone who had signed up on Swetrix before that change can continue to use their free tier.',
    ],
  },
  {
    date: '2023-02-09',
    changes: [
      'Added an ability to filter data by custom events.',
      <>
        Released a public
        {' '}
        <a href={`${DOCS_URL}/statistics-api`} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500' target='_blank' rel='noopener noreferrer'>
          API Documentation
        </a>
        {' '}
        related to data aggregation.
      </>,
      'Fully refactored the authentication system.',
      'Added support for API keys.',
    ],
  },
  {
    date: '2023-02-04',
    changes: [
      'Added a Polish translation.',
      <>
        Added a
        {' '}
        <Link to={routes.cookiePolicy} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'>
          Cookie policy
        </Link>
        .
      </>,
    ],
  },
  {
    date: '2023-01-28',
    changes: [
      'Added time notation setting: now you can display chart hours in 12-hour or 24-hour format.',
      'Fixed live visitors dropdown overlap for non-English languages.',
    ],
  },
  {
    date: '2023-01-17',
    changes: [
      <>
        Got rid of our custom documentation page and migrated to Docusaurus insted. Check it out at
        {' '}
        <a href={DOCS_URL} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500' target='_blank' rel='noopener noreferrer'>
          {DOCS_URL}
        </a>
        .
      </>,
    ],
  },
  {
    date: '2023-01-05',
    changes: [
      <>
        Added notification channels integrations. Now you can connect your Telegram account to our official bot and receive notifications (e.g. when someone logins into your account), set up custom project alerts and much more! You can set up the integration in your
        {' '}
        <Link to={INTEGRATIONS_LINK} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500'>
          account settings
        </Link>
        .
      </>,
      'Added new tab in Dashboard: Alerts.\nAutomated alerts are a powerful tool that allow you to run automated tasks when specific events occur.\nWe can automatically monitor your project for traffic spikes and notify you via Telegram.',
    ],
  },
  {
    date: '2023-01-03',
    changes: [
      'Added new tab in Dashboard: Performance. By switching to it you\'ll be able to see the performance of your website, page loading by country, some detailed statistics like TTFB, DOM Content Load, DNS response time and so on.\nTo collect the performance data you need to upgrade swetrix.js tracking script to v2.0.0 or higher.\nIf you\'re using the UMD build - the latest version is pulled automatically.\nIf you\'re using the NPM package - make sure to update it manually.',
    ],
  },
  {
    date: '2022-12-30',
    changes: [
      'Added an ability to see live visitors on your website. Now you\'re able to not only see how many visitors you have, but actually see some information about them.',
      'Added new metric: session duration. Now you\'re able to see how long your users are staying on your website.',
      'Added new chart metrics: bounce rate, views per session, trendlines and session duration.',
      <>
        Added the comparisons column to the footer. There&apos;s only
        {' '}
        <a href={SWETRIX_VS_GOOGLE} className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500' target='_blank' rel='noopener noreferrer' aria-label='Swetrix to Google Analytics comparison (opens in a new tab)'>
          Google Analytics comparison
        </a>
        {' '}
        for now, but more will be added soon.
      </>,
      'Improved chart colours.',
      'Launched the changelog page! 🎉',
    ],
  },
]

const Changelog = (): JSX.Element => {
  const { t }: {
    t: (key: string) => string
  } = useTranslation('common')

  return (
    <div className='min-h-min-footer bg-gray-50 dark:bg-slate-900'>
      <div className='w-11/12 md:w-4/5 mx-auto pb-16 pt-12 px-4 sm:px-6 lg:px-8 whitespace-pre-line'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight'>
          {t('titles.changelog')}
        </h1>

        <div className='relative sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[calc(11rem)]  sm:pb-12 mt-10'>
          <div className='hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-700 sm:block' />
          <div className='space-y-16'>
            {_map(changelog, (item) => {
              const date = dayjs(item.date).format('YYYY-MM-DDT00:00:00.000Z')
              const displayDate = dayjs(item.date).locale('en').format('MMM DD, YYYY')

              return (
                <div key={item.date} className='relative group'>
                  <div className='absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl group-hover:bg-slate-50/70 dark:group-hover:bg-slate-800/50' />
                  <svg
                    viewBox='0 0 9 9'
                    className='hidden absolute right-full mr-6 top-2 text-slate-200 dark:text-slate-600 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block'
                  >
                    <circle
                      cx='4.5'
                      cy='4.5'
                      r='4.5'
                      stroke='currentColor'
                      className='fill-white dark:fill-slate-800'
                      strokeWidth={2}
                    />
                  </svg>
                  <div className='relative'>
                    <ul className='list-disc text-gray-900 dark:text-gray-50 relative top-7 lg:top-0 lg:block text-base mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-dark line-clamp-2'>
                      {_map(item.changes, (change) => (
                        // @ts-ignore
                        <li key={change} className='whitespace-pre-line'>{change}</li>
                      ))}
                    </ul>
                    <dl className='absolute left-1.5 top-0 lg:left-auto lg:right-full lg:mr-[calc(5rem+1px)]'>
                      <dt className='sr-only'>Date</dt>
                      <dd className='whitespace-nowrap text-sm leading-6 text-slate-700 dark:text-slate-300'>
                        <time dateTime={date}>
                          {displayDate}
                        </time>
                      </dd>
                    </dl>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Changelog