import type { LoaderFunction } from '@remix-run/cloudflare'
import type { SitemapFunction } from 'remix-sitemap'
import { json } from '@remix-run/cloudflare'
import NotFound from 'pages/NotFound'

export const sitemap: SitemapFunction = () => ({
  exclude: true,
})

export const loader: LoaderFunction = () => {
  return json(null, { status: 404 })
}

export default function Index() {
  return <NotFound />
}
