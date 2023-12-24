import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import { getItem, removeItem, setItem } from 'utils/localstorage'
import {
  getProjectCacheKey,
  LS_VIEW_PREFS_SETTING,
  LS_CAPTCHA_VIEW_PREFS_SETTING,
  getProjectCaptchaCacheKey,
  getUserFlowCacheKey,
  isBrowser,
} from 'redux/constants'
import { IUserFlow } from 'redux/models/IUserFlow'
import { filterInvalidViewPrefs } from 'pages/Project/View/ViewProject.helpers'

export const getInitialViewPrefs = (LS_VIEW: string) => {
  if (!isBrowser) {
    return {}
  }

  const storedPrefs = getItem(LS_VIEW)

  try {
    return filterInvalidViewPrefs(storedPrefs)
  } catch (e) {
    removeItem(LS_VIEW)
  }

  return {}
}

interface IInitialState {
  analytics: any
  analyticsPerf: any
  funnels: any
  captchaAnalytics: any
  captchaProjectsViewPrefs: any
  customEventsPrefs: any
  projectViewPrefs: {
    [key: string]: {
      period: string
      timeBucket: string
      rangeDate?: Date[]
    }
  } | null
  userFlowAscending: {
    [key: string]: IUserFlow
  }
  userFlowDescending: {
    [key: string]: IUserFlow
  }
  activeReferrals: any[]
  referralStatistics: any
}

const initialState: IInitialState = {
  analytics: {},
  analyticsPerf: {},
  funnels: {},
  captchaAnalytics: {},
  captchaProjectsViewPrefs: getInitialViewPrefs(LS_CAPTCHA_VIEW_PREFS_SETTING) || {},
  projectViewPrefs: getInitialViewPrefs(LS_VIEW_PREFS_SETTING),
  customEventsPrefs: {},
  userFlowAscending: {},
  userFlowDescending: {},
  activeReferrals: [],
  referralStatistics: {},
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setProjectCache(state, { payload }: PayloadAction<{ pid: string; key: string; data: any }>) {
      state.analytics = {
        ...state.analytics,
        [payload.pid]: {
          ...state.analytics[payload.pid],
          [payload.key]: payload.data,
        },
      }
    },
    setCaptchaProjectCache(state, { payload }: PayloadAction<{ pid: string; key: string; data: any }>) {
      state.captchaAnalytics = {
        ...state.captchaAnalytics,
        [payload.pid]: {
          ...state.captchaAnalytics[payload.pid],
          [payload.key]: payload.data,
        },
      }
    },
    deleteProjectCache(
      state,
      { payload }: PayloadAction<{ pid?: string; period?: string; timeBucket?: string; filters?: any }>,
    ) {
      const { pid, period, timeBucket, filters } = payload
      let key: string

      if (period && timeBucket && filters) {
        key = getProjectCacheKey(period, timeBucket, filters)
      }

      if (_isEmpty(period) || _isEmpty(timeBucket)) {
        if (_isEmpty(pid)) {
          state.analytics = {}
        }
        state.analytics = _filter(state.analytics, (project) => project !== pid)
      }
      if (pid) {
        state.analytics = {
          ...state.analytics,
          [pid]: _filter(state.analytics[pid], (ckey) => ckey !== key),
        }
      }
    },
    deleteCaptchaProjectCache(
      state,
      { payload }: PayloadAction<{ pid: string; period?: string; timeBucket?: string }>,
    ) {
      const { pid, period, timeBucket } = payload
      let key: string

      if (period && timeBucket) {
        key = getProjectCaptchaCacheKey(period, timeBucket)
      }

      if (_isEmpty(period) || _isEmpty(timeBucket)) {
        if (_isEmpty(pid)) {
          state.captchaAnalytics = {}
        }
        state.captchaAnalytics = _filter(state.captchaAnalytics, (project) => project !== pid)
      }
      state.captchaAnalytics = {
        ...state.captchaAnalytics,
        [pid]: _filter(state.captchaAnalytics[pid], (ckey) => ckey !== key),
      }
    },
    setProjectViewPrefs(
      state,
      { payload }: PayloadAction<{ pid: string; period: string; timeBucket: string; rangeDate?: Date[] }>,
    ) {
      const { pid, period, timeBucket, rangeDate } = payload
      const viewPrefs = rangeDate
        ? {
            period,
            timeBucket,
            rangeDate,
          }
        : {
            period,
            timeBucket,
          }
      const storedPrefs = getItem(LS_VIEW_PREFS_SETTING) as {
        [key: string]: {
          period: string
          timeBucket: string
          rangeDate?: Date[]
        }
      }
      if (typeof storedPrefs === 'object' && storedPrefs !== null) {
        storedPrefs[pid] = viewPrefs
        setItem(LS_VIEW_PREFS_SETTING, JSON.stringify(storedPrefs))
      } else {
        setItem(LS_VIEW_PREFS_SETTING, JSON.stringify({ [pid]: viewPrefs }))
      }
      state.projectViewPrefs = {
        ...state.projectViewPrefs,
        [pid]: viewPrefs,
      }
    },
    setCaptchaProjectViewPrefs(
      state,
      { payload }: PayloadAction<{ pid: string; period: string; timeBucket: string; rangeDate?: Date[] | null }>,
    ) {
      const { pid, period, timeBucket, rangeDate } = payload
      const viewPrefs = rangeDate
        ? {
            period,
            timeBucket,
            rangeDate,
          }
        : {
            period,
            timeBucket,
          }
      const storedPrefs = getItem(LS_CAPTCHA_VIEW_PREFS_SETTING) as {
        [key: string]: {
          period: string
          timeBucket: string
          rangeDate?: Date[]
        }
      }
      if (typeof storedPrefs === 'object' && storedPrefs !== null) {
        storedPrefs[pid] = viewPrefs
        setItem(LS_CAPTCHA_VIEW_PREFS_SETTING, JSON.stringify(storedPrefs))
      } else {
        setItem(LS_CAPTCHA_VIEW_PREFS_SETTING, JSON.stringify({ [pid]: viewPrefs }))
      }
      state.captchaProjectsViewPrefs = {
        ...state.captchaProjectsViewPrefs,
        [pid]: viewPrefs,
      }
    },
    setProjectCachePerf(state, { payload }: PayloadAction<{ pid: string; key: string; data: any }>) {
      state.analyticsPerf = {
        ...state.analyticsPerf,
        [payload.pid]: {
          ...state.analyticsPerf[payload.pid],
          [payload.key]: payload.data,
        },
      }
    },
    setFunnelsCache(state, { payload }: PayloadAction<{ pid: string; key: string; data: any }>) {
      state.funnels = {
        ...state.funnels,
        [payload.pid]: {
          ...state.funnels[payload.pid],
          [payload.key]: payload.data,
        },
      }
    },
    setProjectForecastCache(state, { payload }: PayloadAction<{ pid: string; key: string; data: any }>) {
      state.analytics = {
        ...state.analytics,
        [payload.pid]: {
          ...state.analytics[payload.pid],
          [payload.key]: payload.data,
        },
      }
    },
    setCustomEventsPrefs(state, { payload }: PayloadAction<{ pid: string; data: any }>) {
      state.customEventsPrefs = {
        ...state.customEventsPrefs,
        [payload.pid]: {
          ...state.customEventsPrefs[payload.pid],
          ...payload.data,
        },
      }
    },
    setUserFlowAscending(
      state,
      { payload }: PayloadAction<{ pid: string; period: string; data: IUserFlow; filters: any }>,
    ) {
      const key = getUserFlowCacheKey(payload.pid, payload.period, payload.filters)

      state.userFlowAscending = {
        ...state.userFlowAscending,
        [key]: payload.data,
      }
    },
    setUserFlowDescending(
      state,
      { payload }: PayloadAction<{ pid: string; period: string; data: IUserFlow; filters: any }>,
    ) {
      const key = getUserFlowCacheKey(payload.pid, payload.period, payload.filters)

      state.userFlowDescending = {
        ...state.userFlowDescending,
        [key]: payload.data,
      }
    },
    setCache(state, { payload }: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = payload

      // @ts-ignore
      state[key] = value
    },
  },
})

export const cacheActions = cacheSlice.actions

export default cacheSlice.reducer
