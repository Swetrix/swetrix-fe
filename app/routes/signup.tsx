import Singup from 'pages/Auth/Signup'
import type { SitemapFunction } from 'remix-sitemap'
import type { HeadersFunction, LoaderArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/cloudflare'

import { detectTheme } from 'utils/server'

export const headers: HeadersFunction = () => {
  return {
    'X-Frame-Options': 'DENY',
  }
}

export async function loader({ request }: LoaderArgs) {
  const theme = detectTheme(request)

  return json({ theme })
}

export const sitemap: SitemapFunction = () => ({
  priority: 0.9,
})

export default function Index() {
  const {
    theme,
  } = useLoaderData<typeof loader>()

  return <Singup ssrTheme={theme} />
}
