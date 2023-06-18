import CaptchaView from 'pages/Captcha/View'
import type { LinksFunction } from '@remix-run/cloudflare'
import ProjectViewStyle from 'styles/ProjectViewStyle.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: ProjectViewStyle },
]

export default function Index() {
  return <CaptchaView />
}
