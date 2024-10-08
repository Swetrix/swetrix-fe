import { call, put, delay } from 'redux-saga/effects'
import type i18next from 'i18next'
import { toast } from 'sonner'

import { authActions } from 'redux/reducers/auth'
import { setAccessToken } from 'utils/accessToken'
import { setRefreshToken } from 'utils/refreshToken'
import { openBrowserWindow } from 'utils/generic'
import { getCookie, deleteCookie } from 'utils/cookie'
import { REFERRAL_COOKIE } from 'redux/constants'
import sagaActions from '../../actions/index'
const { getJWTBySSOHash, generateSSOAuthURL } = require('api')

const AUTH_WINDOW_WIDTH = 600
const AUTH_WINDOW_HEIGHT = 800

const HASH_CHECK_FREQUENCY = 1000 // 1 second

interface ISSOAuth {
  payload: {
    callback: (isSuccess: boolean, is2FA: boolean) => void
    dontRemember: boolean
    t: typeof i18next.t
    provider: string
  }
}

export default function* ssoAuth({ payload: { callback, dontRemember, t, provider } }: ISSOAuth) {
  const authWindow = openBrowserWindow('', AUTH_WINDOW_WIDTH, AUTH_WINDOW_HEIGHT)

  if (!authWindow) {
    toast.error(t('apiNotifications.socialisationAuthGenericError'))
    callback(false, false)
    return
  }

  try {
    const { uuid, auth_url: authUrl, expires_in: expiresIn } = yield call(generateSSOAuthURL, provider)

    // Set the URL of the authentification browser window
    authWindow.location = authUrl

    // Closing the authorisation window after the session expires
    setTimeout(authWindow.close, expiresIn)

    const refCode = getCookie(REFERRAL_COOKIE)

    while (true) {
      yield delay(HASH_CHECK_FREQUENCY)

      try {
        const { accessToken, refreshToken, user } = yield call(getJWTBySSOHash, uuid, provider, refCode)
        authWindow.close()

        if (refCode) {
          deleteCookie(REFERRAL_COOKIE)
        }

        yield put(authActions.setDontRemember(dontRemember))

        if (user.isTwoFactorAuthenticationEnabled) {
          yield call(setAccessToken, accessToken, true)
          yield call(setRefreshToken, refreshToken)
          yield put(authActions.updateUserData(user))
          callback(false, true)
          return
        }

        yield put(authActions.loginSuccessful(user))
        yield call(setAccessToken, accessToken, dontRemember)
        yield call(setRefreshToken, refreshToken)
        // yield put(UIActions.setThemeType(user.theme))
        yield put(sagaActions.loadProjects())
        yield put(sagaActions.loadSharedProjects())
        yield put(sagaActions.loadProjectsCaptcha())
        yield put(sagaActions.loadProjectAlerts())
        yield put(sagaActions.loadMonitors())
        yield put(authActions.finishLoading())
        callback(true, false)
        return
      } catch (reason) {
        // Authentication is not finished yet
      }
      if (authWindow.closed) {
        callback(false, false)
        return
      }
    }
  } catch (reason) {
    toast.error(t('apiNotifications.socialisationAuthGenericError'))
    callback(false, false)
  }
}
