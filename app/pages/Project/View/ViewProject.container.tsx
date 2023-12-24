import { connect } from 'react-redux'
import { errorsActions } from 'redux/reducers/errors'
import UIActions from 'redux/reducers/ui'
import { tabForSharedProject } from 'redux/constants'
import { alertsActions } from 'redux/reducers/alerts'
import { StateType, AppDispatch } from 'redux/store'
import { IProject } from 'redux/models/IProject'
import { ISharedProject } from 'redux/models/ISharedProject'

import ViewProject from './ViewProject'

const mapStateToProps = (state: StateType) => {
  if (state.ui.projects.dashboardTabs === tabForSharedProject) {
    return {
      projects: state.ui.projects.projects,
      sharedProjects: state.ui.projects.sharedProjects,
      isLoading: state.ui.projects.isLoadingShared,
      cache: state.ui.cache.analytics,
      cachePerf: state.ui.cache.analyticsPerf,
      cacheFunnels: state.ui.cache.funnels,
      projectViewPrefs: state.ui.cache.projectViewPrefs,
      authenticated: state.auth.authenticated,
      authLoading: state.auth.loading,
      timezone: state.auth.user.timezone,
      extensions: state.ui.misc.extensions,
      user: state.auth.user,
      projectTab: state.ui.projects.projectTab,
      customEventsPrefs: state.ui.cache.customEventsPrefs,
      liveStats: state.ui.projects.liveStats,
      password: state.ui.projects.password,
      theme: state.ui.theme.theme,
    }
  }

  return {
    projects: state.ui.projects.projects,
    sharedProjects: state.ui.projects.sharedProjects,
    isLoading: state.ui.projects.isLoading,
    authLoading: state.auth.loading,
    cache: state.ui.cache.analytics,
    cachePerf: state.ui.cache.analyticsPerf,
    cacheFunnels: state.ui.cache.funnels,
    projectViewPrefs: state.ui.cache.projectViewPrefs,
    authenticated: state.auth.authenticated,
    timezone: state.auth.user.timezone,
    extensions: state.ui.misc.extensions,
    user: state.auth.user,
    projectTab: state.ui.projects.projectTab,
    customEventsPrefs: state.ui.cache.customEventsPrefs,
    liveStats: state.ui.projects.liveStats,
    password: state.ui.projects.password,
    theme: state.ui.theme.theme,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  showError: (message: string) => {
    dispatch(
      errorsActions.genericError({
        message,
      }),
    )
  },
  setProjectCache: (pid: string, data: any, key: string) => {
    dispatch(
      UIActions.setProjectCache({
        pid,
        key,
        data,
      }),
    )
  },
  setProjectViewPrefs: (pid: string, period: string, timeBucket: string, rangeDate?: Date[]) => {
    dispatch(
      UIActions.setProjectViewPrefs({
        pid,
        period,
        timeBucket,
        rangeDate,
      }),
    )
  },
  setProjectCachePerf: (pid: string, data: any, key: string) => {
    dispatch(
      UIActions.setProjectCachePerf({
        pid,
        data,
        key,
      }),
    )
  },
  setFunnelsCache: (pid: string, data: any, key: string) => {
    dispatch(
      UIActions.setFunnelsCache({
        pid,
        data,
        key,
      }),
    )
  },
  setPublicProject: (project: Partial<IProject | ISharedProject>) => {
    dispatch(
      UIActions.setPublicProject({
        project,
      }),
    )
  },
  setProjects: (project: Partial<IProject | ISharedProject>[], shared?: boolean) => {
    dispatch(
      UIActions.setProjects({
        projects: project,
        shared,
      }),
    )
  },
  updateProject: (pid: string, project: Partial<IProject | ISharedProject>) => {
    dispatch(
      UIActions.updateProject({
        pid,
        project,
      }),
    )
  },
  setLiveStatsForProject: (id: string, count: number) => {
    dispatch(
      UIActions.setLiveStatsProject({
        id,
        count,
      }),
    )
  },
  generateAlert: (message: string, type: string) => {
    dispatch(
      alertsActions.generateAlerts({
        message,
        type,
      }),
    )
  },
  setProjectTab: (tabs: string) => {
    dispatch(UIActions.setProjectTab(tabs))
  },
  setProjectForcastCache: (pid: string, data: any, key: string) => {
    dispatch(
      UIActions.setProjectForecastCache({
        pid,
        data,
        key,
      }),
    )
  },
  setCustomEventsPrefs: (pid: string, data: any) => {
    dispatch(
      UIActions.setCustomEventsPrefs({
        pid,
        data,
      }),
    )
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewProject)
