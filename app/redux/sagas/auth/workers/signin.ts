import { call, put } from 'redux-saga/effects'
import _isObject from 'lodash/isPlainObject'
import _omit from 'lodash/omit'
import { toast } from 'sonner'
import { authActions } from 'redux/reducers/auth'

import UIActions from 'redux/reducers/ui'
import { setAccessToken } from 'utils/accessToken'
import { setRefreshToken } from 'utils/refreshToken'
import sagaActions from '../../actions/index'
const { login } = require('api')

interface ISigninWorker {
  payload: {
    credentials: {
      email: string
      password: string
      dontRemember: boolean
    }
    callback: (isSuccess: boolean, isTwoFactorAuthenticationEnabled: boolean) => void
  }
}

export default function* singinWorker({ payload: { credentials, callback } }: ISigninWorker) {
  try {
    const { dontRemember } = credentials
    const { user, accessToken, refreshToken } = yield call(login, _omit(credentials, ['dontRemember']))

    yield put(authActions.setDontRemember(dontRemember))

    if (user.isTwoFactorAuthenticationEnabled) {
      yield call(setAccessToken, accessToken, true)
      yield call(setRefreshToken, refreshToken, true)
      yield put(authActions.updateUserData(user))
      callback(false, true)
      return
    }

    yield put(authActions.loginSuccessful(user))
    yield call(setAccessToken, accessToken, dontRemember)
    yield call(setRefreshToken, refreshToken)
    yield put(UIActions.setThemeType(user.theme))
    yield put(sagaActions.loadProjects())
    yield put(sagaActions.loadSharedProjects())
    yield put(sagaActions.loadProjectsCaptcha())
    yield put(sagaActions.loadProjectAlerts())
    yield put(sagaActions.loadMonitors())
    callback(true, false)
  } catch (error: any) {
    const err = _isObject(error) ? error.message : error

    toast.error(err || 'apiNotifications.somethingWentWrong')
    callback(false, false)
  } finally {
    yield put(authActions.finishLoading())
  }
}
