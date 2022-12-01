import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import Flag from 'react-flagkit'
import PropTypes from 'prop-types'

import {
  isSelfhosted, DONATE_URL, FIREFOX_ADDON_URL, CHROME_EXTENSION_URL, GITHUB_URL,
  LINKEDIN_URL, STATUSPAGE_URL, TWITTER_URL, BLOG_URL, UTM_GENERATOR_URL,
} from 'redux/constants'
import routes from 'routes'

const navigation = {
  support: [
    (authenticated) => (authenticated ? { key: 'billing', href: routes.billing } : { key: 'pricing', href: `${routes.main}#pricing` }),
    () => ({ key: 'docs', href: routes.docs }),
    () => ({ key: 'guides', href: `${routes.docs}#docs-ht` }),
  ],
  company: [
    { key: 'about', href: routes.about, internal: true },
    { key: 'contact', href: routes.contact, internal: true },
    { key: 'status', href: STATUSPAGE_URL },
    { key: 'donate', href: DONATE_URL },
    { key: 'blog', href: BLOG_URL },
    { key: 'utm', href: UTM_GENERATOR_URL },
  ],
  legal: [
    { key: 'privacy', href: routes.privacy },
    { key: 'terms', href: routes.terms },
  ],
  social: [
    {
      name: 'GitHub',
      href: GITHUB_URL,
      icon: (props) => (
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
      icon: (props) => (
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
      name: 'LinkedIn',
      href: LINKEDIN_URL,
      icon: () => (
        <img className='h-6 w-6 opacity-75 hover:opacity-90 bg-white rounded' aria-hidden='true' src='/assets/linkedin.svg' alt='' />
      ),
    },
    {
      name: 'Firefox Addon',
      href: FIREFOX_ADDON_URL,
      icon: () => (
        <img className='h-6 w-6 opacity-75 hover:opacity-90' aria-hidden='true' src='/assets/firefox.svg' alt='' />
      ),
    },
    {
      name: 'Chrome Extension',
      href: CHROME_EXTENSION_URL,
      icon: () => (
        <img className='h-6 w-6 opacity-75 hover:opacity-90' aria-hidden='true' src='/assets/chrome.svg' alt='' />
      ),
    },
  ],
}

const Footer = ({ minimal, authenticated }) => {
  const { t, i18n: { language } } = useTranslation('common')
  const year = new Date().getFullYear()

  if (minimal) {
    return (
      <footer className='bg-gray-800 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8 relative z-10'>
          <nav className='-mx-5 -my-2 flex flex-wrap justify-center' aria-label='Footer'>
            <div className='px-5 py-2'>
              <Link to={routes.contact} className='text-base text-gray-300 hover:text-white'>
                {t('footer.contact')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link to={routes.privacy} className='text-base text-gray-300 hover:text-white'>
                {t('footer.pp')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link to={routes.terms} className='text-base text-gray-300 hover:text-white'>
                {t('footer.tos')}
              </Link>
            </div>
            <div className='px-5 py-2'>
              <Link to={routes.about} className='text-base text-gray-300 hover:text-white'>
                {t('footer.about')}
              </Link>
            </div>
            {!isSelfhosted && (
              <div className='px-5 py-2'>
                <a href={STATUSPAGE_URL} className='text-base text-gray-300 hover:text-white' target='_blank' rel='noopener noreferrer'>
                  {t('footer.status')}
                </a>
              </div>
            )}
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer className='bg-gray-800 dark:bg-[#181F29]' aria-labelledby='footer-heading'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='w-11/12 mx-auto pt-8 pb-5 px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-8'>
          <div className='space-y-8 xl:col-span-1'>
            <div className='flex gap-5 flex-wrap'>
              <img className='h-10' src='/assets/logo_white_christmas.png' loading='lazy' alt='Swetrix Analytics' />
            </div>
            <p className='text-gray-300 text-base'>
              {t('footer.slogan')}
              <br />
              {t('footer.description')}
            </p>
            <div>
              <p className='flex text-gray-300 text-base'>
                {t('footer.madeIn')}
                <a className='flex hover:underline hover:opacity-80 text-blue-400 ml-1' href={`https://${language}.wikipedia.org/wiki/Ukraine`} target='_blank' rel='noopener noreferrer'>
                  <Flag country='UA' size={18} alt='' />
                  &nbsp;
                  {t('footer.ukraine')}
                </a>
              </p>
              <p className='flex text-gray-300 text-base'>
                {t('footer.hostedIn')}
                <a className='flex hover:underline hover:opacity-80 text-blue-400 ml-1' href={`https://${language}.wikipedia.org/wiki/European_Union`} target='_blank' rel='noopener noreferrer'>
                  <Flag country='EU' size={18} alt='' />
                  &nbsp;
                  {t('footer.eu')}
                </a>
              </p>
            </div>
            <div className='flex space-x-4'>
              {_map(navigation.social, (item) => (
                <a key={item.name} href={item.href} title={item.name} target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-gray-300'>
                  <span className='sr-only'>{item.name}</span>
                  <item.icon className='h-6 w-6' aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>
          <div className='mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2'>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div />
              <div className='mt-12 md:mt-0'>
                <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>
                  {t('footer.support')}
                </h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.support, (func) => {
                    const { key, href } = func(authenticated)

                    return (
                      <li key={key}>
                        <HashLink to={href} className='text-base text-gray-300 hover:text-white'>
                          {t(`footer.${key}`)}
                        </HashLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>
                  {t('footer.company')}
                </h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.company, ({ key, href, internal }) => (
                    <li key={key}>
                      {internal ? (
                        <Link to={href} className='text-base text-gray-300 hover:text-white'>
                          {t(`footer.${key}`)}
                        </Link>
                      ) : (
                        <a href={href} className='text-base text-gray-300 hover:text-white' target='_blank' rel='noopener noreferrer'>
                          {t(`footer.${key}`)}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-12 md:mt-0'>
                <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>
                  {t('footer.legal')}
                </h3>
                <ul className='mt-4 space-y-4'>
                  {_map(navigation.legal, ({ key, href }) => (
                    <li key={key}>
                      <Link to={href} className='text-base text-gray-300 hover:text-white'>
                        {t(`footer.${key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='flex gap-5 flex-wrap col-span-2 items-center justify-end'>
              <img className='h-10 w-auto' src='/assets/pci.png' height='40' width='auto' loading='lazy' alt='' />
              <img className='h-10 w-auto' src='/assets/visa.png' height='40' width='auto' loading='lazy' alt='' />
              <img className='h-10 w-auto' src='/assets/mc.png' height='40' width='auto' loading='lazy' alt='' />
            </div>
          </div>
        </div>
        <div className='mt-6 border-t border-[#727987] pt-5'>
          <p className='text-base text-gray-300 xl:text-center'>
            &copy;
            {' '}
            {year}
            {' '}
            {t('footer.copy')}
          </p>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  minimal: PropTypes.bool,
}

Footer.defaultProps = {
  minimal: false,
}

export default memo(Footer)
