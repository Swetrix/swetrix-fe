import { PassThrough } from 'node:stream'
import { resolve as feResolve } from 'node:path'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import FSBackend from 'i18next-fs-backend'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { createSitemapGenerator } from 'remix-sitemap'
import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare'
import { renderToReadableStream } from 'react-dom/server'

import { MAIN_URL } from './redux/constants'
import i18next from './i18next.server'
import i18n, { detectLanguage } from './i18n'

const ABORT_DELAY = 5_000

const { isSitemapUrl, sitemap } = createSitemapGenerator({
  siteUrl: MAIN_URL,
  autoLastmod: false,
  priority: 0.8,
})

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  if (isSitemapUrl(request)) {
    const stm = await sitemap(request, remixContext)
    return stm
  }

  const instance = createInstance()
  const lng = detectLanguage(request)
  const ns = i18next.getRouteNamespaces(remixContext)

  await instance
    .use(initReactI18next)
    .use(FSBackend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: {
        loadPath: feResolve('./public/locales/{{lng}}.json'),
      },
    })

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error)
        responseStatusCode = 500
      },
    },
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
