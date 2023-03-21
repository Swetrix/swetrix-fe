/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { store } from 'redux/store'
import Debug from 'debug'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _isArray from 'lodash/isArray'
import { authActions } from 'redux/actions/auth'

import { getAccessToken, removeAccessToken, setAccessToken } from 'utils/accessToken'
import { getRefreshToken, removeRefreshToken } from 'utils/refreshToken'
import { DEFAULT_ALERTS_TAKE, isSelfhosted } from 'redux/constants'

const debug = Debug('swetrix:api')
const baseURL = isSelfhosted ? window.env.API_URL : process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL,
})

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest) =>
  axios
    .post(`${baseURL}v1/auth/refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${getRefreshToken()}`,
      },
    })
    .then((tokenRefreshResponse) => {
      const { accessToken } = tokenRefreshResponse.data
      setAccessToken(accessToken)
      // eslint-disable-next-line
      failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`
      return Promise.resolve()
    })
    .catch((error) => {
      store.dispatch(authActions.logout())
      return Promise.reject(error)
    })

// Instantiate the interceptor
createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401, 403],
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const authMe = () =>
  api
    .get('user/me')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const logoutApi = (refreshToken) =>
  axios
    .post(`${baseURL}v1/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
    .then((response) => {
      removeAccessToken()
      removeRefreshToken()
      return response.data
    })
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const refreshToken = () =>
  api
    .post('v1/auth/refresh-token')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const login = (credentials) =>
  api
    .post('v1/auth/login', credentials)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const signup = (data) =>
  api
    .post('v1/auth/register', data)
    .then((response) => response.data)
    .catch((error) => {
      const errorsArray = error.response.data.message
      if (_isArray(errorsArray)) {
        throw errorsArray
      }
      throw new Error(errorsArray)
    })

export const deleteUser = () =>
  api
    .delete('/user')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(JSON.stringify(error.response.data))
    })

export const changeUserDetails = (data) =>
  api
    .put('/user', data)
    .then((response) => response.data)
    .catch((error) => {
      const errorsArray = error.response.data.message
      if (_isArray(errorsArray)) {
        throw errorsArray
      }
      throw new Error(errorsArray)
    })

export const forgotPassword = (email) =>
  api
    .post('v1/auth/reset-password', email)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const confirmEmail = () =>
  api
    .post('/user/confirm_email')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const exportUserData = () =>
  api
    .get('/user/export')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const createNewPassword = (id, password) =>
  api
    .post(`v1/auth/reset-password/confirm/${id}`, { newPassword: password })
    .then((response) => response.data)
    .catch((error) => {
      const errorsArray = error.response.data.message
      if (_isArray(errorsArray)) {
        throw errorsArray
      }
      throw new Error(errorsArray)
    })

export const verifyEmail = ({ id }) =>
  api
    .get(`v1/auth/verify-email/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const verifyShare = ({ path, id }) =>
  api
    .get(`/project/${path}/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getProjects = (take = 0, skip = 0, isCaptcha = false) =>
  api
    .get(`/project?take=${take}&skip=${skip}&isCaptcha=${isCaptcha}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getSharedProjects = (take = 0, skip = 0) =>
  api
    .get(`/project/shared?take=${take}&skip=${skip}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getProject = (pid, isCaptcha = false) =>
  api
    .get(`/project/${pid}?isCaptcha=${isCaptcha}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const createProject = (data) =>
  api
    .post('/project', data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const updateProject = (id, data) =>
  api
    .put(`/project/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteProject = (id) =>
  api
    .delete(`/project/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteCaptchaProject = (id) =>
  api
    .delete(`project/captcha/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const resetProject = (id) =>
  api
    .delete(`/project/reset/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const resetCaptchaProject = (id) =>
  api
    .delete(`project/captcha/reset/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getProjectData = (
  pid,
  tb = 'hour',
  period = '3d',
  filters = [],
  from = '',
  to = '',
  timezone = '',
) =>
  api
    .get(
      `log?pid=${pid}&timeBucket=${tb}&period=${period}&filters=${JSON.stringify(filters)}&from=${from}&to=${to}&timezone=${timezone}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getPerfData = (
  pid,
  tb = 'hour',
  period = '3d',
  filters = [],
  from = '',
  to = '',
  timezone = '',
) =>
  api
    .get(
      `log/performance?pid=${pid}&timeBucket=${tb}&period=${period}&filters=${JSON.stringify(filters)}&from=${from}&to=${to}&timezone=${timezone}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getCaptchaData = (
  pid,
  tb = 'hour',
  period = '3d',
  filters = [],
  from = '',
  to = '',
) =>
  api
    .get(
      `log/captcha?pid=${pid}&timeBucket=${tb}&period=${period}&filters=${JSON.stringify(filters)}&from=${from}&to=${to}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getOverallStats = (pids) =>
  api
    .get(`log/birdseye?pids=[${_map(pids, (pid) => `"${pid}"`).join(',')}]`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getOverallStatsCaptcha = (pids) =>
  api
    .get(`log/captcha/birdseye?pids=[${_map(pids, (pid) => `"${pid}"`).join(',')}]`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getLiveVisitors = (pids) =>
  api
    .get(`log/hb?pids=[${_map(pids, (pid) => `"${pid}"`).join(',')}]`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getGeneralStats = () =>
  api
    .get('log/generalStats')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const shareProject = (pid, data) =>
  api
    .post(`/project/${pid}/share`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteShareProjectUsers = (pid, userId) =>
  api
    .delete(`/project/${pid}/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteShareProject = (pid) =>
  api
    .delete(`user/share/${pid}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const acceptShareProject = (id) =>
  api
    .get(`user/share/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const changeShareRole = (id, data) =>
  api
    .put(`project/share/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const generate2FA = () =>
  api
    .post('2fa/generate')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const enable2FA = (twoFactorAuthenticationCode) =>
  api
    .post('2fa/enable', { twoFactorAuthenticationCode })
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const disable2FA = (twoFactorAuthenticationCode) =>
  api
    .post('2fa/disable', { twoFactorAuthenticationCode })
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const submit2FA = (twoFactorAuthenticationCode) =>
  api
    .post('2fa/authenticate', { twoFactorAuthenticationCode })
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const generateApiKey = () =>
  api
    .post('user/api-key')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteApiKey = () =>
  api
    .delete('user/api-key')
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getInstalledExtensions = (limit = 100, offset = 0) =>
  api
    .get(`/extensions/installed?limit=${limit}&offset=${offset}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const setTheme = (theme) =>
  api
    .put('user/theme', { theme })
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getLiveVisitorsInfo = (pid) =>
  api
    .get(`log/liveVisitors?pid=${pid}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const removeTgIntegration = (tgID) =>
  api
    .delete(`user/tg/${tgID}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getAlerts = (take = DEFAULT_ALERTS_TAKE, skip = 0) =>
  api
    .get(`alert?take=${take}&skip=${skip}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const createAlert = (data) =>
  api
    .post('alert', data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const updateAlert = (id, data) =>
  api
    .put(`alert/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deleteAlert = (id) =>
  api
    .delete(`alert/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const setTimeFormat = (timeFormat) =>
  api
    .put('user/change-time-format', { timeFormat })
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const reGenerateCaptchaSecretKey = (pid) =>
  api
    .post(`project/secret-gen/${pid}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const addSubscriber = (id, data) =>
  api
    .post(`project/${id}/subscribers`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const getSubscribers = (id, offset, limit) =>
  api
    .get(`project/${id}/subscribers?offset=${offset}&limit=${limit}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const updateSubscriber = (id, subscriberId, data) =>
  api
    .patch(`project/${id}/subscribers/${subscriberId}`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const removeSubscriber = (id, subscriberId) =>
  api
    .delete(`project/${id}/subscribers/${subscriberId}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const confirmSubscriberInvite = (id, token) =>
  api
    .get(`project/${id}/subscribers/invite?token=${token}`)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })

export const deletePartially = (id, data) =>
  api
    .delete(`project/partially/${id}?from=${data.from}&to=${data.to}`, data)
    .then((response) => response.data)
    .catch((error) => {
      debug('%s', error)
      throw _isEmpty(error.response.data?.message)
        ? error.response.data
        : error.response.data.message
    })
