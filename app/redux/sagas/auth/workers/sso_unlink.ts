import { call, put } from 'redux-saga/effects'
import type i18next from 'i18next'
import _values from 'lodash/values'
import _includes from 'lodash/includes'

import { authActions } from 'redux/reducers/auth'
import { errorsActions } from 'redux/reducers/errors'
import { alertsActions } from 'redux/reducers/alerts'
import { SSO_PROVIDERS } from 'redux/constants'
const { unlinkSSO, authMe } = require('api')

export interface ISSOUnlink {
  payload: {
    provider: string
    t: typeof i18next.t
    callback: (isSuccess: boolean) => void
  }
}

export default function* ssoUnlink({ payload: { provider, t, callback } }: ISSOUnlink) {
  if (!_includes(_values(SSO_PROVIDERS), provider)) {
    callback(false)
    return
  }

  try {
    yield call(unlinkSSO, provider)

    // @ts-ignore
    const user = yield call(authMe)
    yield put(authActions.loginSuccessful(user))

    yield put(
      alertsActions.generateAlerts({
        message: t('apiNotifications.socialAccountUninked'),
        type: 'success',
      }),
    )
    callback(true)
  } catch (reason) {
    yield put(
      errorsActions.loginFailed({
        message: t('apiNotifications.socialisationUnlinkGenericError'),
      }),
    )
    callback(false)
  }
}
