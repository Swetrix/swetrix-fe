/* eslint-disable jsx-a11y/anchor-has-content, react/jsx-one-expression-per-line */
import React, { memo, Fragment, useEffect } from 'react'
import _map from 'lodash/map'
import Prism from 'prismjs'
import { useTranslation, Trans } from 'react-i18next'

import Title from 'components/Title'
import Code from 'ui/Code'
import {
  umdBuildExample, trackPageView, trackPVAPI, init, track, trackExample, npmInstall,
  esExample, npmImport, trackPVReturnAPI,
} from './examples'

const contents = (t) => [{
  name: t('docs.titles.start'),
  id: 'docs-gs',
  content: [{
    name: t('docs.titles.umd'),
    id: 'docs-umd',
  }, {
    name: t('docs.titles.npm'),
    id: 'docs-npm',
  }, {
    name: t('docs.titles.int'),
    id: 'docs-int',
  }],
}, {
  name: t('docs.titles.how'),
  id: 'docs-ht',
  content: [{
    name: t('docs.titles.pv'),
    id: 'docs-pv',
  }, {
    name: t('docs.titles.ce'),
    id: 'docs-ce',
  }],
}, {
  name: t('docs.titles.api'),
  id: 'docs-api',
  content: [{
    name: 'init',
    id: 'docs-init',
  }, {
    name: 'track',
    id: 'docs-tr',
  }, {
    name: 'trackViews',
    id: 'docs-tv',
  }],
}]

const NEXTJS_REPO_URL = 'https://github.com/Swetrix/swetrix-nextjs'

const integrations = [
  {
    name: 'Next.js',
    link: NEXTJS_REPO_URL,
  },
  {
    name: 'Python Django',
    link: 'https://github.com/Swetrix/integrations/blob/main/django/README.md',
  },
  {
    name: 'Webflow',
    link: 'https://github.com/Swetrix/integrations/blob/main/webflow/README.md',
  },
  {
    name: 'Wordpress',
    link: 'https://github.com/Swetrix/integrations/blob/main/wordpress/README.md',
  },
  {
    name: 'Wix',
    link: 'https://github.com/Swetrix/integrations/blob/main/wix/README.md',
  },
  {
    name: 'Ghost',
    link: 'https://github.com/Swetrix/integrations/blob/main/ghost/README.md',
  },
  {
    name: 'SvelteKit',
    link: 'https://github.com/Swetrix/integrations/blob/main/sveltekit/README.md',
  },
]

const thirdPartyIntegrations = [
  {
    name: 'Java SDK',
    link: 'https://github.com/Casterlabs/swetrix-java',
  },
  {
    name: 'Vue',
    link: 'https://github.com/ansidev/swetrix-vue',
  },
]

const Contents = ({ t }) => {
  const tContents = contents(t)

  return (
    <div className='lg:flex flex-1 items-start justify-center lg:order-2 relative '>
      <h2 className='block lg:hidden text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight'>
        {t('docs.contents')}
        :
      </h2>
      <ol className='mb-10 lg:mb-0 lg:sticky lg:top-10'>
        {_map(tContents, ({ name, id, content }) => (
          <Fragment key={id}>
            <li className='mt-3'>
              <a className='hover:underline text-2xl text-blue-600 dark:text-gray-50 font-bold' href={`#${id}`}>{name}</a>
            </li>
            <ol>
              {_map(content, ({ name: cname, id: cid }) => (
                <li key={cid}>
                  <a className='hover:underline text-lg text-blue-500 dark:text-gray-200 px-4' href={`#${cid}`}>{cname}</a>
                </li>
              ))}
            </ol>
          </Fragment>
        ))}
      </ol>
    </div>
  )
}

const CHeader = ({ id, name, addHr = true }) => (
  <>
    {addHr && (
      <hr className='mt-10 border-gray-200 dark:border-gray-600' />
    )}
    <h2 id={id} className='text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mt-2 -mb-5'>{name}</h2>
  </>
)

const CSection = ({ id, name }) => (
  <h3 id={id} className='text-2xl font-normal text-gray-900 dark:text-gray-50 tracking-tight mt-8'>{name}</h3>
)

const Docs = () => {
  const { t } = useTranslation('common')

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <Title title={t('titles.docs')}>
      <div className='bg-gray-50 dark:bg-gray-800'>
        <div className='w-11/12 mx-auto pb-16 pt-12 px-4 sm:px-6 lg:w-11/12 lg:px-8 lg:flex relative '>
          <Contents t={t} />
          <div className='flex-1 lg:order-1 whitespace-pre-line'>
            <h1 className='text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('titles.docs')}
            </h1>

            <CHeader id='docs-gs' name={t('docs.titles.start')} addHr={false} />
            <CSection id='docs-umd' name={t('docs.titles.umd')} />
            <Code text={umdBuildExample} language='html' />

            <CSection id='docs-npm' name={t('docs.titles.npm')} />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.install')}
              :
            </p>
            <Code text={npmInstall} language='bash' />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.import')}
              :
            </p>
            <Code text={npmImport} language='javascript' />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.track')}
            </p>
            <Code text={esExample} language='javascript' />

            <CSection id='docs-int' name={t('docs.titles.int')} />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.integrations')}
              :
            </p>
            <ul className='ml-5 text-lg list-disc marker:text-gray-900 dark:marker:text-gray-50'>
              {_map(integrations, ({ name, link }) => (
                <li key={name}>
                  <a href={link} className='flex hover:underline hover:opacity-80 text-indigo-600 dark:text-indigo-400 ml-1' target='_blank' rel='noopener noreferrer'>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <p className='text-lg mt-5 text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.3rdPartyInt')}
              :
            </p>
            <ul className='ml-5 text-lg list-disc marker:text-gray-900 dark:marker:text-gray-50'>
              {_map(thirdPartyIntegrations, ({ name, link }) => (
                <li key={name}>
                  <a href={link} className='flex hover:underline hover:opacity-80 text-indigo-600 dark:text-indigo-400 ml-1' target='_blank' rel='noopener noreferrer'>
                    {name}
                  </a>
                </li>
              ))}
            </ul>

            <CHeader id='docs-ht' name={t('docs.titles.how')} />
            <CSection id='docs-pv' name={t('docs.titles.pv')} />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              <Trans
                t={t}
                i18nKey='docs.pv'
                components={{
                  url: <a href='#docs-tv' className='font-bold hover:underline' />,
                }}
              />
            </p>
            <Code text={trackPageView} language='javascript' />

            <CSection id='docs-ce' name={t('docs.titles.ce')} />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.ce')}
            </p>
            <Code text={trackExample} language='javascript' />

            <CHeader id='docs-api' name={t('docs.titles.api')} />

            <CSection id='docs-init' name='init' />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.init')}
            </p>
            <Code text={init} language='javascript' />

            <CSection id='docs-tr' name='track' />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.tr')}
            </p>
            <Code text={track} language='javascript' />

            <CSection id='docs-tv' name='trackViews' />
            <div className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.tv.call')}
              <div className='mb-5'>
                <ul className='ml-10'>
                  <li><b>pid</b> - {t('docs.tv.params.pid')}</li>
                  <li><b>lc</b> - {t('docs.tv.params.lc')}</li>
                  <li><b>tz</b> - {t('docs.tv.params.tz')}</li>
                  <li><b>ref</b> - {t('docs.tv.params.ref')}</li>
                  <li><b>so</b> - {t('docs.tv.params.so')}</li>
                  <li><b>me</b> - {t('docs.tv.params.me')}</li>
                  <li><b>ca</b> - {t('docs.tv.params.ca')}</li>
                  <li><b>pg</b> - {t('docs.tv.params.pg')}</li>
                </ul>
              </div>
              <Trans
                t={t}
                i18nKey='docs.tv.gather'
                components={{
                  b: <b />,
                }}
              />
            </div>
            <Code text={trackPVAPI} language='javascript' />
            <p className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              {t('docs.tvReturn')}
            </p>
            <Code text={trackPVReturnAPI} language='javascript' />

            <hr className='mt-10 mb-4 border-gray-200 dark:border-gray-600' />
            <div className='text-lg text-gray-900 dark:text-gray-50 tracking-tight'>
              <i>Last updated: September 6, 2022.</i><br />
              <div>
                - Added Vue, Java SDK and SvelteKit&nbsp;
                <a className='hover:underline text-gray-700 dark:text-gray-300' href='#docs-int'>integration instructions.</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Title>
  )
}

export default memo(Docs)
