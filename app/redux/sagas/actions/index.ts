/* eslint-disable no-unused-vars */
import types from 'redux/sagas/actions/types'
import type i18next from 'i18next'
import { removeAccessToken } from 'utils/accessToken'
import { removeItem } from 'utils/localstorage'
import { LS_VIEW_PREFS_SETTING, LS_CAPTCHA_VIEW_PREFS_SETTING } from 'redux/constants'
import { IUser } from '../../models/IUser'

const loadProjects = (take?: number, skip?: number, search?: string) => ({
  type: types.LOAD_PROJECTS,
  payload: { take, skip, search },
})

const loadMetainfo = () => ({
  type: types.LOAD_METAINFO,
})

const loadUsageinfo = () => ({
  type: types.LOAD_USAGEINFO,
})

const loadSharedProjects = (take?: number, skip?: number, search?: string) => ({
  type: types.LOAD_SHARED_PROJECTS,
  payload: { take, skip, search },
})

const loadProjectsCaptcha = (take?: number, skip?: number, search?: string) => ({
  type: types.LOAD_PROJECTS,
  payload: { take, skip, isCaptcha: true, search },
})

const loadExtensions = () => ({
  type: types.LOAD_EXTENSIONS,
})

const loadProjectAlerts = (take?: number, skip?: number) => ({
  type: types.LOAD_PROJECT_ALERTS,
  payload: { take, skip },
})

const loginAsync = (
  credentials: {
    email: string
    password: string
    dontRemember: boolean
  },
  callback = () => {},
) => ({
  type: types.LOGIN_ASYNC,
  payload: {
    credentials,
    callback,
  },
})

// currently only google is supported, in future we should provide a variable specifying the provider
const authSSO = (
  provider: string,
  dontRemember: boolean,
  // @ts-expect-error
  t: typeof i18next.t = () => '',
  callback: (res: any) => void = () => {},
) => ({
  type: types.AUTH_SSO,
  payload: {
    dontRemember,
    callback,
    t,
    provider,
  },
})

// currently only google is supported, in future we should provide a variable specifying the provider
// @ts-expect-error
const linkSSO = (t: typeof i18next.t = () => '', callback: (res: any) => void = () => {}, provider = 'google') => ({
  type: types.LINK_SSO,
  payload: {
    callback,
    t,
    provider,
  },
})

// currently only google is supported, in future we should provide a variable specifying the provider
// @ts-expect-error
const unlinkSSO = (t: typeof i18next.t = () => '', callback: (res: any) => void = () => {}, provider = 'google') => ({
  type: types.UNLINK_SSO,
  payload: {
    callback,
    t,
    provider,
  },
})

const signupAsync = (
  data: {
    email: string
    password: string
  },
  t?: (string: string) => {},
  callback = (res: any) => {},
) => ({
  type: types.SIGNUP_ASYNC,
  payload: {
    data,
    callback,
    t,
  },
})

const emailVerifyAsync = (
  data: {
    id: string
  },
  successfulCallback?: () => void,
  errorCallback?: (e: string) => void,
) => ({
  type: types.EMAIL_VERIFY_ASYNC,
  payload: { data, successfulCallback, errorCallback },
})

const updateUserProfileAsync = (data: Partial<IUser>, callback = (item: any) => {}) => ({
  type: types.UPDATE_USER_PROFILE_ASYNC,
  payload: { data, callback },
})

const deleteAccountAsync = (
  errorCallback?: (e: string) => {},
  successCallback?: (str?: string) => void,
  deletionFeedback?: string,
  t?: (str: string) => {},
) => {
  return {
    type: types.DELETE_ACCOUNT_ASYNC,
    payload: {
      errorCallback,
      successCallback,
      t,
      deletionFeedback,
    },
  }
}

const shareVerifyAsync = (
  data: {
    id: string
    path: string
  },
  successfulCallback?: () => void,
  errorCallback?: (error: string) => void,
) => ({
  type: types.SHARE_VERIFY_ASYNC,
  payload: { data, successfulCallback, errorCallback },
})

const logout = (basedOn401Error: boolean, isLogoutAll: boolean) => {
  removeAccessToken()
  removeItem(LS_VIEW_PREFS_SETTING)
  removeItem(LS_CAPTCHA_VIEW_PREFS_SETTING)

  return {
    type: types.LOGOUT,
    payload: { basedOn401Error, isLogoutAll },
  }
}

const updateShowLiveVisitorsInTitle = (show: boolean, callback: (isSuccess: boolean) => void) => ({
  type: types.UPDATE_SHOW_LIVE_VISITORS_IN_TITLE,
  payload: {
    show,
    callback,
  },
})

const sagaActions = {
  loadProjects,
  loadSharedProjects,
  loadProjectsCaptcha,
  loadExtensions,
  loadProjectAlerts,
  loginAsync,
  authSSO,
  signupAsync,
  emailVerifyAsync,
  updateUserProfileAsync,
  deleteAccountAsync,
  logout,
  shareVerifyAsync,
  linkSSO,
  unlinkSSO,
  loadMetainfo,
  loadUsageinfo,
  updateShowLiveVisitorsInTitle,
}

export default sagaActions
