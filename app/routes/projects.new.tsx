import NewProject from 'pages/Project/New'
import type { SitemapFunction } from 'remix-sitemap'

export const sitemap: SitemapFunction = () => ({
  exclude: true,
})

export default function Index() {
  return <NewProject />
}
