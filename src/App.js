import React, {
  useEffect, lazy, Suspense, useState,
} from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import routes from 'routes'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from '@blaumaus/react-alert'
import cx from 'clsx'
import _some from 'lodash/some'
import _includes from 'lodash/includes'
import 'dayjs/locale/ru'
import 'dayjs/locale/uk'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Loader from 'ui/Loader'

import ScrollToTop from 'hoc/ScrollToTop'
import Selfhosted from 'hoc/Selfhosted'
import { isSelfhosted, THEME_TYPE } from 'redux/constants'
import { getAccessToken } from 'utils/accessToken'
import { authActions } from 'redux/actions/auth'
import { errorsActions } from 'redux/actions/errors'
import { alertsActions } from 'redux/actions/alerts'
import UIActions from 'redux/actions/ui'
import { authMe } from './api'

const MainPage = lazy(() => import('pages/MainPage'))
const SignUp = lazy(() => import('pages/Auth/Signup'))
const SignIn = lazy(() => import('pages/Auth/Signin'))
const ForgotPassword = lazy(() => import('pages/Auth/ForgotPassword'))
const CreateNewPassword = lazy(() => import('pages/Auth/CreateNewPassword'))
const Dashboard = lazy(() => import('pages/Dashboard'))
const Contact = lazy(() => import('pages/Contact'))
const Docs = lazy(() => import('pages/Docs'))
const Features = lazy(() => import('pages/Features'))
const UserSettings = lazy(() => import('pages/UserSettings'))
const VerifyEmail = lazy(() => import('pages/Auth/VerifyEmail'))
const ProjectSettings = lazy(() => import('pages/Project/Settings'))
const ViewProject = lazy(() => import('pages/Project/View'))
const Billing = lazy(() => import('pages/Billing'))
const Privacy = lazy(() => import('pages/Privacy'))
const ConfirmShare = lazy(() => import('pages/Project/ConfirmShare'))
const Terms = lazy(() => import('pages/Terms'))
const NotFound = lazy(() => import('pages/NotFound'))
const About = lazy(() => import('pages/About'))

const minimalFooterPages = [
  '/projects', '/dashboard', '/settings', '/contact',
]

const Fallback = ({ isMinimalFooter }) => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    let isMounted = true

    setTimeout(() => {
      if (isMounted) {
        setShowLoader(true)
      }
    }, 1000)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className={cx('bg-gray-50 dark:bg-gray-800', { 'min-h-page': !isMinimalFooter, 'min-h-min-footer': isMinimalFooter })}>
      {showLoader && (
        <Loader />
      )}
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const alert = useAlert()
  const { loading, authenticated } = useSelector(state => state.auth)
  const { theme } = useSelector(state => state.ui.theme)
  const { error } = useSelector(state => state.errors)
  const { message, type } = useSelector(state => state.alerts)
  const themeType = useSelector(state => state.ui.theme.type)
  const accessToken = getAccessToken()

  useEffect(() => {
    const eventCallback = (data) => {
      dispatch(UIActions.setPaddleLastEvent(data))
    }
    // eslint-disable-next-line no-use-before-define
    const interval = setInterval(paddleSetup, 200)

    function paddleSetup() {
      if (isSelfhosted) {
        clearInterval(interval)
      } else if (window.Paddle) {
        window.Paddle.Setup({
          vendor: 139393,
          eventCallback,
        })
        clearInterval(interval)
      }
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    const loaderEl = document.getElementById('loader')

    if (loaderEl) {
      loaderEl.classList.add('available')
      setTimeout(() => {
        loaderEl.outerHTML = ''
      }, 1000)
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (accessToken && !authenticated) {
        try {
          const me = await authMe()
          dispatch(UIActions.setThemeType(me.theme))
          dispatch(authActions.loginSuccess(me))
          dispatch(authActions.finishLoading())
        } catch (e) {
          dispatch(authActions.logout())
        }
      }
    })()
  }, [authenticated]) // eslint-disable-line

  useEffect(() => {
    if (error) {
      alert.error(error.toString(), {
        onClose: () => {
          dispatch(errorsActions.clearErrors())
        },
      })
    }
  }, [error]) // eslint-disable-line

  useEffect(() => {
    if (message && type) {
      alert.show(message.toString(), {
        type,
        onClose: () => {
          dispatch(alertsActions.clearAlerts())
        },
      })
    }
  }, [message, type]) // eslint-disable-line

  const isMinimalFooter = _some(minimalFooterPages, (page) => _includes(location.pathname, page))
  // const createSnowFlake = () => {
  //   const snowFlake = document.createElement('i')
  //   snowFlake.setAttribute('class', 'snowflake')
  //   snowFlake.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  //   snowFlake.setAttribute('viewBox', '0 0 512 512')
  //   snowFlake.innerHTML = Snow
  //   snowFlake.style.left = `${Math.random() * window.innerWidth}px`
  //   snowFlake.style.top = `${(Math.random() * window.innerHeight) + window.scrollY}px`
  //   snowFlake.style.animationDuration = `${Math.random() * 3 + 2}s`
  //   snowFlake.style.width = `${Math.random() * 12 + 10}px`
  //   snowFlake.style.height = `${Math.random() * 12 + 10}px`
  //   snowFlake.style.opacity = Math.random()
  //   snowFlake.style.fontSize = `${Math.random() * 12 + 10}px`
  //   document.getElementById('root').appendChild(snowFlake)

  //   setTimeout(() => {
  //     snowFlake.remove()
  //   }, 5000)
  // }

  // useEffect(() => {
  //   setInterval(createSnowFlake, 500)
  // }, [])

  return (
    (!accessToken || !loading) && (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <Suspense fallback={<></>}>
        <Header authenticated={authenticated} theme={theme} themeType={themeType} />
        {themeType === THEME_TYPE.christmas && (
          <div
            className='snow'
          />
        )}
        <ScrollToTop>
          <Selfhosted>
            <Suspense fallback={<Fallback theme={theme} isMinimalFooter={isMinimalFooter} />}>
              <Switch>
                <Route path={routes.main} component={MainPage} exact />
                <Route path={routes.signin} component={SignIn} exact />
                <Route path={routes.signup} component={SignUp} exact />
                <Route path={routes.dashboard} component={Dashboard} exact />
                <Route path={routes.user_settings} component={UserSettings} exact />
                <Route path={routes.verify} component={VerifyEmail} exact />
                <Route path={routes.change_email} component={VerifyEmail} exact />
                <Route path={routes.reset_password} component={ForgotPassword} exact />
                <Route path={routes.new_password_form} component={CreateNewPassword} exact />
                <Route path={routes.new_project} component={ProjectSettings} exact />
                <Route path={routes.project_settings} component={ProjectSettings} exact />
                <Route path={routes.project} component={ViewProject} exact />
                <Route path={routes.billing} component={Billing} exact />
                <Route path={routes.docs} component={Docs} exact />
                <Route path={routes.contact} component={Contact} exact />
                <Route path={routes.features} component={Features} exact />
                <Route path={routes.privacy} component={Privacy} exact />
                <Route path={routes.terms} component={Terms} exact />
                <Route path={routes.confirm_share} component={ConfirmShare} exact />
                <Route path={routes.about} component={About} exact />
                <Route path='*' component={NotFound} />
              </Switch>
            </Suspense>
          </Selfhosted>
        </ScrollToTop>
        <Footer minimal={isMinimalFooter} authenticated={authenticated} />
      </Suspense>
    )
  )
}

export default App
