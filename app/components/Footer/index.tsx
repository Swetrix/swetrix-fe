import React, { memo } from 'react'
import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import Flag from 'react-flagkit'

import {
  isSelfhosted,
  DONATE_URL,
  FIREFOX_ADDON_URL,
  CHROME_EXTENSION_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  STATUSPAGE_URL,
  TWITTER_URL,
  UTM_GENERATOR_URL,
  SWETRIX_VS_GOOGLE,
  SWETRIX_VS_CLOUDFLARE,
  DOCS_URL,
  SWETRIX_VS_SIMPLE_ANALYTICS,
  DISCORD_URL,
  CAPTCHA_URL,
} from 'redux/constants'
import routesPath from 'routesPath'

const navigation = {
  company: [
    { key: 'about', href: routesPath.about, internal: true },
    { key: 'changelog', href: routesPath.changelog, internal: true },
    { key: 'open', href: routesPath.open, internal: true },
    { key: 'press', href: routesPath.press, internal: true },
    { key: 'status', href: STATUSPAGE_URL },
    { key: 'donate', href: DONATE_URL },
    { key: 'blog', href: routesPath.blog, internal: true },
  ],
  legal: [
    (
      authenticated: boolean | undefined,
    ): {
      key: string
      href: string
      internal: boolean
    } =>
      authenticated
        ? { key: 'billing', href: routesPath.billing, internal: true }
        : { key: 'pricing', href: `${routesPath.main}#pricing`, internal: true },
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'docs', href: DOCS_URL, internal: false }),
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'contact', href: routesPath.contact, internal: true }),
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'privacy', href: routesPath.privacy, internal: true }),
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'terms', href: routesPath.terms, internal: true }),
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'cookie', href: routesPath.cookiePolicy, internal: true }),
    (): {
      key: string
      href: string
      internal: boolean
    } => ({ key: 'imprint', href: routesPath.imprint, internal: true }),
  ],
  features: [
    { value: 'vs Google Analytics', href: SWETRIX_VS_GOOGLE },
    { value: 'vs Cloudflare Analytics', href: SWETRIX_VS_CLOUDFLARE },
    { value: 'vs Simple Analytics', href: SWETRIX_VS_SIMPLE_ANALYTICS },
    { key: 'captcha', href: CAPTCHA_URL, internal: false },
    { key: 'utm', href: UTM_GENERATOR_URL, internal: false },
  ],
  social: [
    {
      name: 'GitHub',
      href: GITHUB_URL,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill='currentColor' viewBox='0 0 24 24' {...props}>
          <path
            d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
            fillRule='evenodd'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: TWITTER_URL,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill='currentColor' viewBox='0 0 24 24' {...props}>
          <path
            d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'
            fillRule='evenodd'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    {
      name: 'Discord',
      href: DISCORD_URL,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill='currentColor' viewBox='0 0 127.14 96.36' {...props}>
          <path d='M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z' />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: LINKEDIN_URL,
      icon: () => (
        <img
          className='h-6 w-6 rounded bg-white opacity-75 hover:opacity-90'
          aria-hidden='true'
          src='/assets/linkedin.svg'
          alt='LinkedIn'
        />
      ),
    },
    {
      name: 'Firefox Addon',
      href: FIREFOX_ADDON_URL,
      icon: () => (
        <img
          className='h-6 w-6 opacity-75 hover:opacity-90'
          aria-hidden='true'
          src='/assets/firefox.svg'
          alt='Firefox'
        />
      ),
    },
    {
      name: 'Chrome Extension',
      href: CHROME_EXTENSION_URL,
      icon: () => (
        <img className='h-6 w-6 opacity-75 hover:opacity-90' aria-hidden='true' src='/assets/chrome.svg' alt='Chrome' />
      ),
    },
  ],
}

const SelfHostedFooter = () => {
  const { t } = useTranslation('common')

  return (
    <footer className='border-t border-gray-200 bg-gray-50 dark:border-slate-800/50 dark:bg-slate-900'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8'>
        <nav className='-mx-5 -my-2 flex flex-wrap justify-center' aria-label='Footer'>
          <div className='px-5 py-2'>
            <Link
              to={routesPath.contact}
              className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
            >
              {t('footer.contact')}
            </Link>
          </div>
          <div className='px-5 py-2'>
            <a
              href={UTM_GENERATOR_URL}
              className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${t('footer.status')} (opens in a new tab)`}
            >
              {t('footer.utm')}
            </a>
          </div>
          <div className='px-5 py-2'>
            <a
              href={DONATE_URL}
              className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${t('footer.status')} (opens in a new tab)`}
            >
              {t('footer.donate')}
            </a>
          </div>
          <div className='px-5 py-2'>
            <Link
              to={routesPath.about}
              className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
            >
              {t('footer.about')}
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  )
}

interface IFooter {
  minimal?: boolean
  authenticated?: boolean
  showDBIPMessage?: boolean
}

const Footer = ({ minimal, authenticated, showDBIPMessage }: IFooter): JSX.Element => {
  const {
    t,
    i18n: { language },
  } = useTranslation('common')
  const year = new Date().getFullYear()

  if (isSelfhosted) {
    return <SelfHostedFooter />
  }

  if (minimal) {
    return (
      <footer className='border-t border-gray-200 bg-gray-50 dark:border-slate-800/50 dark:bg-slate-900'>
        <div className='mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8'>
          <nav className='relative -mx-5 -my-2 flex flex-wrap justify-center' aria-label='Footer'>
            <div className='px-5 py-2'>
              <Link
                to={routesPath.contact}
                className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              >
                {t('footer.contact')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link
                to={routesPath.privacy}
                className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              >
                {t('footer.pp')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link
                to={routesPath.terms}
                className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              >
                {t('footer.tos')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link
                to={routesPath.about}
                className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
              >
                {t('footer.about')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <a
                href={STATUSPAGE_URL}
                className='leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${t('footer.status')} (opens in a new tab)`}
              >
                {t('footer.status')}
              </a>
            </div>
            {showDBIPMessage && (
              <a
                className='absolute -bottom-5 leading-6 text-slate-900 hover:text-slate-700 dark:text-gray-300 dark:hover:text-white'
                target='_blank'
                rel='noopener noreferrer'
                href='https://db-ip.com'
                aria-label='IP Geolocation by DB-IP (opens in a new tab)'
              >
                IP Geolocation by DB-IP
              </a>
            )}
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer className='bg-gray-800 dark:bg-gray-750' aria-labelledby='footer-heading'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='w-11/12 px-4 pb-5 pt-8 sm:px-6 lg:px-8'>
        <div className='xl:grid xl:grid-cols-2 xl:gap-8'>
          <div className='space-y-5 xl:col-span-1'>
            <div className='flex flex-wrap gap-5'>
              <img height='28px' width='126.35px' src='/assets/logo_white.png' loading='lazy' alt='Swetrix Analytics' />
            </div>
            <p className='text-base text-gray-300'>
              {t('footer.slogan')}
              <br />
              {t('footer.description')}
            </p>
            <div>
              <p className='flex text-base text-gray-300'>
                {t('footer.madeIn')}
                <a
                  className='ml-1 flex text-blue-400 hover:underline hover:opacity-80'
                  href={`https://${language}.wikipedia.org/wiki/Ukraine`}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Ukraine Wikipedia page (opens in a new tab)'
                >
                  <Flag country='UA' size={18} alt='' aria-hidden='true' />
                  &nbsp;
                  {t('footer.ukraine')}
                </a>
              </p>
              <p className='flex text-base text-gray-300'>
                {t('footer.hostedIn')}
                <a
                  className='ml-1 flex text-blue-400 hover:underline hover:opacity-80'
                  href={`https://${language}.wikipedia.org/wiki/European_Union`}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='European Union Wikipedia page (opens in a new tab)'
                >
                  <Flag country='EU' size={18} alt='' aria-hidden='true' />
                  &nbsp;
                  {t('footer.eu')}
                </a>
              </p>
            </div>
            <div className='flex space-x-4'>
              {_map(navigation.social, (item) => (
                <a
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-gray-300'
                  aria-label={`${item.name} (opens in a new tab)`}
                >
                  <span className='sr-only'>{item.name}</span>
                  <item.icon className='h-6 w-6' aria-hidden='true' />
                </a>
              ))}
            </div>
            <p className='pt-10 text-base text-gray-300'>
              &copy; {year} {t('footer.copy')}
            </p>
          </div>
          <div className='mt-12 xl:mt-0'>
            <div className='grid grid-cols-2 gap-8 md:grid-cols-3'>
              <div>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-white'>{t('footer.features')}</h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.features, (data) => {
                    const { value, key, href, internal } = data

                    const displayValue = value || t(`footer.${key}`)

                    return (
                      <li key={displayValue}>
                        {internal ? (
                          <Link to={href} className='text-base text-gray-300 hover:text-white'>
                            {displayValue}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            className='text-base text-gray-300 hover:text-white'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={`${displayValue} (opens in a new tab)`}
                          >
                            {displayValue}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-white'>{t('footer.company')}</h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.company, ({ key, href, internal }) => (
                    <li key={key}>
                      {internal ? (
                        <Link to={href} className='text-base text-gray-300 hover:text-white'>
                          {t(`footer.${key}`)}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          className='text-base text-gray-300 hover:text-white'
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`${t(`footer.${key}`)} (opens in a new tab)`}
                        >
                          {t(`footer.${key}`)}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-12 md:mt-0'>
                <h3 className='text-sm font-semibold uppercase tracking-wider text-white'>{t('footer.legal')}</h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.legal, (func) => {
                    const { key, href, internal } = func(authenticated)

                    return (
                      <li key={key}>
                        {internal ? (
                          <Link to={href} className='text-base text-gray-300 hover:text-white'>
                            {t(`footer.${key}`)}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            className='text-base text-gray-300 hover:text-white'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={`${t(`footer.${key}`)} (opens in a new tab)`}
                          >
                            {t(`footer.${key}`)}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
