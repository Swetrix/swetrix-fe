const getCustomLabel = (dates: Date[], t: Function): string => {
  if (dates) {
    const from = dates[0].toLocaleDateString()
    const to = dates[1].toLocaleDateString()

    if (from === to) {
      return from
    }

    return `${from} - ${to}`
  }

  return t('project.custom')
}

export const FORECAST_MAX_MAPPING: {
  [key: string]: number
} = {
  hour: 72,
  day: 21,
  week: 21,
  month: 12,
}

export const tbPeriodPairs = (t: Function, tbs?: string[] | null, dates?: Date[]): {
  label: string
  period: string
  tbs: string[]
  access: string
  dropdownLabel?: string
  isCustomDate?: boolean
}[] => [{
  label: t('project.today'),
  period: 'today',
  tbs: ['hour'],
  access: 'free',
}, {
  label: t('project.yesterday'),
  period: 'yesterday',
  tbs: ['hour'],
  access: 'free',
}, {
  label: t('project.last24h'),
  period: '1d',
  tbs: ['hour'],
  access: 'free',
}, {
  label: t('project.lastXDays', { amount: 7 }),
  period: '7d',
  tbs: ['hour', 'day'],
  access: 'free',
}, {
  label: t('project.lastXWeeks', { amount: 4 }),
  period: '4w',
  tbs: ['day', 'week'],
  access: 'free',
}, {
  label: t('project.lastXMonths', { amount: 3 }),
  period: '3M',
  tbs: ['week', 'month'],
  access: 'free',
}, {
  label: t('project.lastXMonths', { amount: 12 }),
  period: '12M',
  tbs: ['week', 'month'],
  access: 'paid',
}, {
  label: t('project.lastXMonths', { amount: 24 }),
  period: '24M',
  tbs: ['month'],
  access: 'paid',
}, {
  label: dates ? getCustomLabel(dates, t) : t('project.custom'),
  dropdownLabel: t('project.custom'),
  isCustomDate: true,
  period: 'custom',
  tbs: tbs || ['custom'],
  access: 'free',
}]

// the order of panels in the project view
export const TRAFFIC_PANELS_ORDER: string[] = ['cc', 'pg', 'lc', 'br', 'os', 'dv', 'ref', 'so', 'me', 'ca']
export const PERFORMANCE_PANELS_ORDER: string[] = ['cc', 'pg', 'br', 'dv']

// the maximum amount of months user can go back when picking a date in flat picker (project view)
export const MAX_MONTHS_IN_PAST: number = 24
export const MAX_MONTHS_IN_PAST_FREE: number = 3

export const timeBucketToDays: {
  lt: number
  tb: string[]
}[] = [
  { lt: 1, tb: ['hour'] }, // 1 days
  { lt: 7, tb: ['hour', 'day'] }, // 7 days
  { lt: 28, tb: ['day', 'week'] }, // 4 weeks
  { lt: 366, tb: ['week', 'month'] }, // 12 months
  { lt: 732, tb: ['month'] }, // 24 months
]

export const tbsFormatMapper: {
  [key: string]: string
} = {
  hour: '%d %b %H:%M',
  day: '%d %b',
  week: '%d %b',
  month: '%d %b %Y',
}

export const tbsFormatMapper24h: {
  [key: string]: string
} = {
  hour: '%H:%M',
  day: '%d %b',
  week: '%d %b',
  month: '%d %b %Y',
}

export const TimeFormat: {
  [key: string]: string
} = {
  '12-hour': '12-hour',
  '24-hour': '24-hour',
}

export const FREE_TIER_KEY: string = 'free'

// a dedicated variable is needed for paid tier checking
export const WEEKLY_REPORT_FREQUENCY: string = 'weekly'
export const reportFrequencies: string[] = [WEEKLY_REPORT_FREQUENCY, 'monthly', 'quarterly', 'never']

export const reportFrequencyForEmailsOptions: {
  value: string
  label: string
}[] = [
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
]

export const GDPR_EXPORT_TIMEFRAME: number = 14 // days

export const SHOW_BANNER_AT_PERC: number = 85 // show banner when 85% of events in tier are used

export const TITLE_SUFFIX: string = '| Swetrix'

export const LS_THEME_SETTING: string = 'colour-theme'
export const LS_VIEW_PREFS_SETTING: string = 'proj-view-preferences'
export const LS_CAPTCHA_VIEW_PREFS_SETTING: string = 'captcha-view-preferences'

export const DEFAULT_TIMEZONE: string = 'Etc/GMT'

export const DONATE_URL: string = 'https://ko-fi.com/andriir'
export const FIREFOX_ADDON_URL: string = 'https://addons.mozilla.org/en-US/firefox/addon/swetrix/'
export const CHROME_EXTENSION_URL: string = 'https://chrome.google.com/webstore/detail/swetrix/glbeclfdldjldjonfnpnembfkhphmeld'
export const HAVE_I_BEEN_PWNED_URL: string = 'https://haveibeenpwned.com/passwords'
export const LINKEDIN_URL: string = 'https://www.linkedin.com/company/swetrix/'
export const GITHUB_URL: string = 'https://github.com/Swetrix'
export const TWITTER_URL: string = 'https://twitter.com/intent/user?screen_name=swetrix'
export const TWITTER_USERNAME: string = '@swetrix'
export const DISCORD_URL: string = 'https://discord.gg/tVxGxU3s4B'
export const STATUSPAGE_URL: string = 'https://stats.uptimerobot.com/33rvmiXXEz'
export const BLOG_URL: string = 'https://blog.swetrix.com'
export const UTM_GENERATOR_URL: string = 'https://url.swetrix.com'
export const MARKETPLACE_URL: string = 'https://marketplace.swetrix.com'
export const DOCS_URL: string = 'https://docs.swetrix.com'
export const CAPTCHA_URL: string = 'https://captcha.swetrix.com'
export const DOCS_CAPTCHA_URL: string = `${DOCS_URL}/captcha/introduction`
export const CDN_URL: string | undefined = process.env.REACT_APP_CDN_URL

// Swetrix vs ...
export const SWETRIX_VS_GOOGLE: string = 'https://blog.swetrix.com/post/vs-google-analytics/'
export const SWETRIX_VS_CLOUDFLARE: string = 'https://blog.swetrix.com/post/vs-cloudflare-analytics/'
export const SWETRIX_VS_SIMPLE_ANALYTICS: string = 'https://blog.swetrix.com/post/vs-simple-analytics/'

export const isDevelopment: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export const SUPPORTED_THEMES: string[] = ['light', 'dark']

export const CONTACT_EMAIL: string = 'contact@swetrix.com'
export const SECURITY_EMAIL: string = 'security@swetrix.com'

export const isSelfhosted: boolean = Boolean(process.env.REACT_APP_SELFHOSTED)

export const LIVE_VISITORS_UPDATE_INTERVAL: number = 40000
export const GENERAL_STATS_UPDATE_INTERVAL: number = 60000

// Functions
export const getProjectCacheKey = (period: string, timeBucket: string): string => `${period}${timeBucket}`
export const getProjectCaptchaCacheKey = (period: string, timeBucket: string): string => `${period}${timeBucket}captcha`
export const getProjectForcastCacheKey = (period: string, timeBucket: string, periodToForecast: string): string => `${period}${timeBucket}${periodToForecast}forecast`
export const getProjectCacheCustomKey = (from: string, to: string, timeBucket: string): string => `${from}-${to}-${timeBucket}`

// Cookies
export const GDPR_REQUEST: string = 'gdpr_request'
export const CONFIRMATION_TIMEOUT: string = 'confirmation_timeout'
export const LOW_EVENTS_WARNING: string = 'low_events_warning'
export const TOKEN: string = 'access_token'
export const REFRESH_TOKEN: string = 'refresh_token'

// LocalStorage
export const PAGE_FORCE_REFRESHED = 'page-force-refreshed'

// List of languages with translations available
export const whitelist: string[] = ['en', 'uk', 'pl', 'de', 'sv', 'el', 'ru', 'hi', 'zh']
export const defaultLanguage: string = 'en'
export const languages: {
  [key: string]: string
} = {
  en: 'English',
  uk: 'Українська',
  pl: 'Polski',
  de: 'Deutsch',
  sv: 'Svenska',
  el: 'Ελληνικά',
  ru: 'Русский',
  hi: 'हिन्दी',
  zh: '中文简体',
}

export const languageFlag: {
  [key: string]: string
} = {
  en: 'GB',
  uk: 'UA',
  pl: 'PL',
  de: 'DE',
  sv: 'SE',
  el: 'GR',
  ru: 'RU',
  hi: 'IN',
  zh: 'CN',
}

export const paddleLanguageMapping: {
  [key: string]: string
} = {
  zh: 'zh-Hans',
  uk: 'ru',
  el: 'en',
}

// dashboard && projects

export const roles: string[] = ['admin', 'viewer']

export const roleViewer: {
  name: string
  role: string
  description: string
} = {
  name: 'Viewer',
  role: 'viewer',
  description: 'Can view the project',
}

export const roleAdmin: {
  name: string
  role: string
  description: string
} = {
  name: 'Admin',
  role: 'admin',
  description: 'Can manage the project',
}

export const tabForOwnedProject: string = 'owned'
export const tabForSharedProject: string = 'shared'
export const tabForCaptchaProject: string = 'captcha'

export const tabsForDashboard: {
  name: string
  label: string
}[] = [
  {
    name: tabForOwnedProject,
    label: 'profileSettings.owned',
  },
  {
    name: tabForSharedProject,
    label: 'profileSettings.shared',
  },
  {
    name: tabForCaptchaProject,
    label: 'profileSettings.captcha',
  },
]

export const PROJECT_TABS: {
  [key: string]: string
} = {
  traffic: 'traffic',
  performance: 'performance',
  alerts: 'alerts',
}

export const DASHBOARD_TABS: {
  [key: string]: string
} = {
  owned: 'owned',
  shared: 'shared',
  captcha: 'captcha',
}

export const QUERY_METRIC: {
  [key: string]: string
} = {
  PAGE_VIEWS: 'page_views',
  UNIQUE_PAGE_VIEWS: 'unique_page_views',
  ONLINE_USERS: 'online_users',
}

export const QUERY_CONDITION: {
  [key: string]: string
} = {
  GREATER_THAN: 'greater_than',
  GREATER_EQUAL_THAN: 'greater_equal_than',
  LESS_THAN: 'less_than',
  LESS_EQUAL_THAN: 'less_equal_than',
}

export const QUERY_TIME: {
  [key: string]: string
} = {
  LAST_15_MINUTES: 'last_15_minutes',
  LAST_30_MINUTES: 'last_30_minutes',
  LAST_1_HOUR: 'last_1_hour',
  LAST_4_HOURS: 'last_4_hours',
  LAST_24_HOURS: 'last_24_hours',
  LAST_48_HOURS: 'last_48_hours',
}

export const INVITATION_EXPIRES_IN: number = 48 // hours
export const ENTRIES_PER_PAGE_DASHBOARD: number = 10

export const THEME_TYPE: {
  [key: string]: string
} = {
  classic: 'classic',
  christmas: 'christmas',
}

export const DEFAULT_ALERTS_TAKE: number = 100

// TODO: Eventually this should be fetched from the API, e.g. GET /config route
export const PLAN_LIMITS: {
  [key: string]: {
    monthlyUsageLimit: number
    maxProjects: number
    maxAlerts: number
    legacy: boolean
    priceMonthly: number
    priceYearly: number
  }
} = {
  free: {
    priceMonthly: 0,
    priceYearly: 0,
    monthlyUsageLimit: 5000,
    maxProjects: 10,
    maxAlerts: 1,
    legacy: true,
  },
  trial: {
    monthlyUsageLimit: 100000,
    maxProjects: 20,
    maxAlerts: 20,
    legacy: false,
    priceMonthly: 0,
    priceYearly: 0,
  },
  hobby: {
    monthlyUsageLimit: 10000,
    maxProjects: 20,
    maxAlerts: 10,
    legacy: false,
    priceMonthly: 5,
    priceYearly: 50,
  },
  freelancer: {
    monthlyUsageLimit: 100000,
    maxProjects: 20,
    maxAlerts: 20,
    legacy: false,
    priceMonthly: 15,
    priceYearly: 150,
  },
  startup: {
    monthlyUsageLimit: 1000000,
    maxProjects: 30,
    maxAlerts: 50,
    legacy: false,
    priceMonthly: 59,
    priceYearly: 590,
  },
  enterprise: {
    monthlyUsageLimit: 5000000,
    maxProjects: 50,
    maxAlerts: 100,
    legacy: false,
    priceMonthly: 110,
    priceYearly: 1100,
  },
}

export const TRIAL_DAYS: number = 14

export const chartTypes = Object.freeze({
  line: 'line',
  bar: 'bar',
})

export const SSO_ACTIONS = Object.freeze({
  LINK: 'link',
  AUTH: 'auth',
})

export const SSO_PROVIDERS = Object.freeze({
  GOOGLE: 'google',
  GITHUB: 'github',
  TWITTER: 'twitter',
})
