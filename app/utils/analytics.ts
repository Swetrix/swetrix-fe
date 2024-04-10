import * as Swetrix from 'swetrix'
import { isDevelopment, isSelfhosted } from 'redux/constants'

const SWETRIX_PID = 'STEzHcB1rALV'

const checkIgnore = (path: string | undefined | null, ignore: RegExp[]) => {
  if (!path) {
    return false
  }

  for (let i = 0; i < ignore.length; ++i) {
    if (ignore[i].test(path)) {
      return true
    }
  }

  return false
}


const REFS_TO_IGNORE = [
  /https:\/\/swetrix.com\/projects\/(?!new$)[^/]+$/i,
  /https:\/\/swetrix.com\/projects\/settings/i,
  /https:\/\/swetrix.com\/verify/i,
  /https:\/\/swetrix.com\/password-reset/i,
  /https:\/\/swetrix.com\/change-email/i,
  /https:\/\/swetrix.com\/share/i,
  /https:\/\/swetrix.com\/captchas\/(?!new$)[^/]+$/i,
  /https:\/\/swetrix.com\/captchas\/settings/i,
]

const PATHS_REPLACEMENT_MAP = [
  {
    regex: /^\/projects\/(?!new$)[^/]+$/i,
    replacement: '/projects/[id]',
  },
  {
    regex: /^\/projects\/settings/i,
    replacement: '/projects/settings/[id]',
  },
  {
    regex: /^\/verify/i,
    replacement: '/verify/[token]',
  },
  {
    regex: /^\/password-reset/i,
    replacement: '/password-reset/[token]',
  },
  {
    regex: /^\/change-email/i,
    replacement: '/change-email/[token]',
  },
  {
    regex: /^\/share/i,
    replacement: '/share/[token]',
  },
  {
    regex: /^\/captchas\/(?!new$)[^/]+$/i,
    replacement: '/captchas/[id]',
  },
  {
    regex: /^\/captchas\/settings/i,
    replacement: '/captchas/settings/[id]',
  },
]

Swetrix.init(SWETRIX_PID, {
  devMode: isDevelopment,
})

const trackViews = () => {
  if (!isSelfhosted) {
    Swetrix.trackViews({
      callback: ({ pg, prev, ref }) => {
        const result = {
          pg,
          prev,
          ref,
        }

        if (checkIgnore(pg, pathsToIgnore)) {
          result.pg = null
        }

        if (checkIgnore(prev, pathsToIgnore)) {
          result.prev = null
        }

        if (checkIgnore(ref, refsToIgnore)) {
          result.ref = undefined
        }

        return result
      },
      heartbeatOnBackground: true,
    })
  }
}

const trackCustom = (ev: string, meta?: any) => {
  if (!isSelfhosted) {
    Swetrix.track({
      ev,
      meta,
    })
  }
}

export { trackViews, trackCustom, SWETRIX_PID }
