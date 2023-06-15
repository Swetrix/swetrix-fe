import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { store } from 'redux/store'
import { isDevelopment, whitelist, isBrowser } from 'redux/constants'
import { Provider } from 'react-redux'
import _map from 'lodash/map'
// @ts-ignore
import { transitions, positions, Provider as AlertProvider } from '@blaumaus/react-alert'
import BillboardCss from 'billboard.js/dist/billboard.min.css'

import AlertTemplate from 'ui/Alert'
import { trackViews } from 'utils/analytics'
import { useChangeLanguage } from 'remix-i18next'
import { useTranslation } from 'react-i18next'
import AppWrapper from 'App'
import { detectLanguage } from 'i18n'

import mainCss from 'styles/index.css'
import tailwindCss from 'styles/tailwind.css'

trackViews()

console.log('%cWelcome, hacker, glad you opened your console, you seem serious about your craft and will go a long way!\nP.S. All the bugs, feature requests are welcome to be sent to security@swetrix.com', 'color: #818cf8background: #1f2937font-size: 20pxtext-shadow: 2px 2px black')

const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 8000,
  offset: '30px',
  transition: transitions.SCALE,
}

if (isBrowser && process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'swetrix:*'
}

const FONTS_PROVIDER = 'https://fonts.bunny.net'
const FONTS_URL = 'https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: mainCss },
  { rel: 'stylesheet', href: BillboardCss },
  { rel: 'preconnect', href: FONTS_PROVIDER },
  { rel: 'stylesheet', href: FONTS_URL },
]

// const removeObsoleteAuthTokens = () => {
//   const accessToken = getAccessToken()
//   const refreshToken = getRefreshToken()

//   if (accessToken && !refreshToken) {
//     removeAccessToken()
//   }
// }

// removeObsoleteAuthTokens()

export function detectTheme(request: Request): string {
  const cookie = request.headers.get('Cookie')
  const theme = cookie?.match(/(?<=colour-theme=)[^;]*/)?.[0]

  if (theme === 'dark') {
    return 'dark'
  }

  return 'light'
}

export async function loader({ request }: LoaderArgs) {
  const { url } = request
  const locale = detectLanguage(request)
  const theme = detectTheme(request)

  return json({ locale, url, theme })
}

export const handle = {
  i18n: 'common',
}

export default function App() {
  const {
    locale, url, theme,
  } = useLoaderData<typeof loader>()
  const { i18n } = useTranslation()

  const alternateLinks = _map(whitelist, (locale) => ({
    rel: 'alternate',
    hrefLang: locale,
    href: `${url}?lng=${locale}`,
  }))

  useChangeLanguage(locale)

  return (
    <html className={theme} lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        {_map(alternateLinks, (link) => (
          <link key={link.hrefLang} {...link} />
        ))}
        <link rel='preload' href={`/locales/${locale}.json`} as='fetch' type='application/json' crossOrigin='anonymous' />
      </head>
      <body>
        <Provider store={store}>
          <AlertProvider template={AlertTemplate} {...options}>
            <AppWrapper />
            <ScrollRestoration />
            <Scripts />
            {isDevelopment && <LiveReload />}
          </AlertProvider>
        </Provider>
      </body>
    </html>
  )
}