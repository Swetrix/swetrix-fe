import { connect } from 'react-redux'
import { errorsActions } from 'redux/reducers/errors'
import { alertsActions } from 'redux/reducers/alerts'
import { StateType, AppDispatch } from 'redux/store'
import { IAnnotations } from 'redux/models/IAnnotations'
import UIActions from 'redux/reducers/ui'
import Annotations from './Annotations'

const mapStateToProps = (state: StateType) => ({
  user: state.auth.user,
  annotationsProjects: state.ui.projects.annotations,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  genericError: (message: string) => {
    dispatch(errorsActions.genericError({
      message,
    }))
  },
  setAnnotations: (annotations: IAnnotations[]) => {
    dispatch(UIActions.setAnnotations({
      annotations,
    }))
  },
  addAnnotations: (message: string, type = 'success') => {
    dispatch(alertsActions.generateAlerts({
      message,
      type,
    }))
  },
  removeAnnotations: (message: string, type = 'success') => {
    dispatch(alertsActions.generateAlerts({
      message,
      type,
    }))
  },
  reportTypeNotifiction: (message: string, type = 'success') => {
    dispatch(alertsActions.generateAlerts({
      message,
      type,
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotations)
