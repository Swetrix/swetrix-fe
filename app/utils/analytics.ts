import * as Swetrix from 'swetrix'
import { isSelfhosted } from 'redux/constants'

const SWETRIX_PID = 'wzfYnFORS9mb'

Swetrix.init(SWETRIX_PID, {
  debug: true,
  apiURL: 'http://localhost:5005/log',
})

const trackViews = () => {
  if (!isSelfhosted) {
    Swetrix.trackViews()
  }
}

const trackCustom = (ev: string, unique = false) => {
  if (!isSelfhosted) {
    Swetrix.track({
      ev, unique,
    })
  }
}

export {
  trackViews, trackCustom, SWETRIX_PID,
}
