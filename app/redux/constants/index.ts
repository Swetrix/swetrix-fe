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
  month: 12,
}

export const KEY_FOR_ALL_TIME = 'all'

export const tbPeriodPairs = (t: Function, tbs?: string[] | null, dates?: Date[]): {
  label: string
  period: string
  tbs: string[]
  countDays?: number
  dropdownLabel?: string
  isCustomDate?: boolean
}[] => [{
  label: t('project.thisHour'),
  period: '1h',
  tbs: ['minute'],
}, {
  label: t('project.today'),
  period: 'today',
  tbs: ['hour'],
}, {
  label: t('project.yesterday'),
  period: 'yesterday',
  tbs: ['hour'],
}, {
  label: t('project.last24h'),
  period: '1d',
  countDays: 1,
  tbs: ['hour'],
}, {
  label: t('project.lastXDays', { amount: 7 }),
  period: '7d',
  tbs: ['hour', 'day'],
  countDays: 7,
}, {
  label: t('project.lastXWeeks', { amount: 4 }),
  period: '4w',
  tbs: ['day'],
  countDays: 28,
}, {
  label: t('project.lastXMonths', { amount: 3 }),
  period: '3M',
  tbs: ['month'],
  countDays: 90,
}, {
  label: t('project.lastXMonths', { amount: 12 }),
  period: '12M',
  tbs: ['month'],
  countDays: 365,
}, {
  label: t('project.lastXMonths', { amount: 24 }),
  period: '24M',
  tbs: ['month'],
}, {
  label: t('project.all'),
  period: KEY_FOR_ALL_TIME,
  tbs: ['month', 'year'],
}, {
  label: dates ? getCustomLabel(dates, t) : t('project.custom'),
  dropdownLabel: t('project.custom'),
  isCustomDate: true,
  period: 'custom',
  tbs: tbs || ['custom'],
}, {
  label: t('project.compare'),
  period: 'compare',
  tbs: tbs || ['custom'],
}]

export const filtersPeriodPairs = ['1h', '1d', '7d', '4w', '3M', '12M', 'custom', 'compare']

export const tbPeriodPairsCompare = (t: Function, dates?: Date[]): {
  label: string
  period: string
}[] => [{
  label: t('project.previousPeriod'),
  period: 'previous',
}, {
  label: dates ? getCustomLabel(dates, t) : t('project.custom'),
  period: 'custom',
}, {
  label: t('project.disableCompare'),
  period: 'disable',
}]

export const PERIOD_PAIRS_COMPARE: {
  COMPARE: string
  PREVIOS: string
  CUSTOM: string
  DISABLE: string
} = {
  COMPARE: 'compare',
  PREVIOS: 'previous',
  CUSTOM: 'custom',
  DISABLE: 'disable',
}

interface IStringObject {
  [key: string]: string
}

// the order of panels in the project view
export const TRAFFIC_PANELS_ORDER: string[] = ['cc', 'pg', 'lc', 'br', 'os', 'dv', 'ref', 'so', 'me', 'ca']
export const FILTERS_PANELS_ORDER: string[] = ['cc', 'pg', 'lc', 'br', 'os', 'dv', 'ref']
export const PERFORMANCE_PANELS_ORDER: string[] = ['cc', 'pg', 'br', 'dv']

// the maximum amount of months user can go back when picking a date in flat picker (project view)
export const MAX_MONTHS_IN_PAST: number = 24

export const timeBucketToDays: {
  lt: number
  tb: string[]
}[] = [
  // { lt: 0, tb: ['minute'] }, // 1 hour
  { lt: 1, tb: ['hour'] }, // 1 days
  { lt: 7, tb: ['hour', 'day'] }, // 7 days
  { lt: 28, tb: ['day'] }, // 4 weeks
  { lt: 366, tb: ['month'] }, // 12 months
  { lt: 732, tb: ['month'] }, // 24 months
]

export const tbsFormatMapper: IStringObject = {
  minute: '%I:%M %p',
  hour: '%I %p',
  day: '%d %b',
  month: '%b %Y',
  year: '%Y',
}

export const tbsFormatMapperTooltip: IStringObject = {
  minute: '%I:%M %p',
  hour: '%d %b %I %p',
  day: '%d %b',
  month: '%b %Y',
  year: '%Y',
}

export const tbsFormatMapperTooltip24h: IStringObject = {
  minute: '%H:%M',
  hour: '%d %b %H:%M',
  day: '%d %b',
  month: '%b %Y',
  year: '%Y',
}

export const tbsFormatMapper24h: IStringObject = {
  minute: '%H:%M',
  hour: '%H:%M',
  day: '%d %b',
  month: '%b %Y',
  year: '%Y',
}

export const TimeFormat: IStringObject = {
  '12-hour': '12-hour',
  '24-hour': '24-hour',
}

export const FREE_TIER_KEY: string = 'free'

export const PADDLE_JS_URL = 'https://cdn.paddle.com/paddle/paddle.js'
export const PADDLE_VENDOR_ID = 139393

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
export const DISCORD_URL: string = 'https://discord.gg/ZVK8Tw2E8j'
export const STATUSPAGE_URL: string = 'https://stats.uptimerobot.com/33rvmiXXEz'
export const MAIN_URL: string = 'https://swetrix.com'
export const REF_URL_PREFIX: string = `${MAIN_URL}/ref/`
export const UTM_GENERATOR_URL: string = 'https://url.swetrix.com'
export const LIVE_DEMO_URL: string = '/projects/STEzHcB1rALV'
export const MARKETPLACE_URL: string = 'https://marketplace.swetrix.com'
export const DOCS_URL: string = 'https://docs.swetrix.com'
export const CAPTCHA_URL: string = 'https://captcha.swetrix.com'
export const DOCS_CAPTCHA_URL: string = `${DOCS_URL}/captcha/introduction`
export const DOCS_REFERRAL_PROGRAM_URL: string = `${DOCS_URL}/affiliate/about`

// Swetrix vs ...
export const SWETRIX_VS_GOOGLE: string = 'https://blog.swetrix.com/post/vs-google-analytics/'
export const SWETRIX_VS_CLOUDFLARE: string = 'https://blog.swetrix.com/post/vs-cloudflare-analytics/'
export const SWETRIX_VS_SIMPLE_ANALYTICS: string = 'https://blog.swetrix.com/post/vs-simple-analytics/'

// Referral program
export const REFERRAL_COOKIE = 'affiliate'
export const REFERRAL_COOKIE_DAYS = 30
export const REFERRAL_DISCOUNT = 20
export const REFERRAL_PENDING_PAYOUT_DAYS = 30
export const REFERRAL_CUT = 0.2
export const REFERRAL_DISCOUNT_CODE = 'REFERRAL_DISCOUNT'

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export type ThemeType = 'dark' | 'light'
export const SUPPORTED_THEMES: string[] = ['light', 'dark']

export const CONTACT_EMAIL: string = 'contact@swetrix.com'
export const SECURITY_EMAIL: string = 'security@swetrix.com'

export const LIVE_VISITORS_UPDATE_INTERVAL: number = 40000

// Environment variables
// Using optional chaining for REMIX_ENV?. to avoid errors when running some unit tests
const isStaging = isBrowser ? window.REMIX_ENV?.STAGING : process.env.STAGING
const STAGING_API_URL = isBrowser ? window.REMIX_ENV?.API_STAGING_URL : process.env.API_STAGING_URL
const PRODUCTION_API_URL = isBrowser ? window.REMIX_ENV?.API_URL : process.env.API_URL

export const API_URL = isStaging ? STAGING_API_URL : PRODUCTION_API_URL
export const BLOG_URL = isBrowser ? window.REMIX_ENV?.BLOG_URL : process.env.BLOG_URL
export const AIAPI_URL = isBrowser ? window.REMIX_ENV?.AIAPI_URL : process.env.AIAPI_URL
export const CDN_URL = isBrowser ? window.REMIX_ENV?.CDN_URL : process.env.CDN_URL
export const NODE_ENV = isBrowser ? window.REMIX_ENV?.NODE_ENV : process.env.NODE_ENV

export const isDevelopment = !NODE_ENV || NODE_ENV === 'development'
export const isSelfhosted = Boolean(
  isBrowser ? window.REMIX_ENV?.SELFHOSTED : process.env.SELFHOSTED,
)

// Functions
export const getProjectCacheKey = (period: string, timeBucket: string, filters?: any): string => `${period}${timeBucket}${filters ? JSON.stringify(filters) : ''}}`
export const getProjectCaptchaCacheKey = (period: string, timeBucket: string, filters?: any): string => `${period}${timeBucket}captcha${filters ? JSON.stringify(filters) : ''}}`
export const getProjectForcastCacheKey = (period: string, timeBucket: string, periodToForecast: string, filters: any): string => `${period}${timeBucket}${periodToForecast}forecast${filters ? JSON.stringify(filters) : ''}`
export const getProjectCacheCustomKey = (from: string, to: string, timeBucket: string, filters: any): string => `${from}-${to}-${timeBucket}${filters ? JSON.stringify(filters) : ''}}`
export const getProjectCacheCustomKeyPerf = (from: string, to: string, timeBucket: string, filters: any): string => `${from}-${to}-${timeBucket}perf${filters ? JSON.stringify(filters) : ''}`
export const getUserFlowCacheKey = (pid: string, period: string, filters: any): string => `${pid}${period}userflow${filters ? JSON.stringify(filters) : ''}`

// Cookies
export const GDPR_REQUEST: string = 'gdpr_request'
export const CONFIRMATION_TIMEOUT: string = 'confirmation_timeout'
export const LOW_EVENTS_WARNING: string = 'low_events_warning'
export const TOKEN: string = 'access_token'
export const REFRESH_TOKEN: string = 'refresh_token'

// LocalStorage
export const PAGE_FORCE_REFRESHED = 'page-force-refreshed'
export const PROJECTS_PROTECTED = 'projects_protected'

export const IS_ACTIVE_COMPARE = 'is-active-compare'

// List of languages with translations available
export const whitelist: string[] = ['en', 'uk', 'pl', 'de', 'sv', 'el', 'ru', 'hi', 'zh']
export const defaultLanguage: string = 'en'
export const languages: IStringObject = {
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

export const languageFlag: IStringObject = {
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

export const paddleLanguageMapping: IStringObject = {
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

interface IDashboardTabs {
  name: string
  label: string
}

export const tabsForDashboard: IDashboardTabs[] = [
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

const SELFHOSTED_PROJECT_TABS: IStringObject = {
  traffic: 'traffic',
  performance: 'performance',
}

const PRODUCTION_PROJECT_TABS: IStringObject = {
  traffic: 'traffic',
  performance: 'performance',
  alerts: 'alerts',
}

export const PROJECT_TABS = isSelfhosted ? SELFHOSTED_PROJECT_TABS : PRODUCTION_PROJECT_TABS

export const DASHBOARD_TABS: IStringObject = {
  owned: 'owned',
  shared: 'shared',
  captcha: 'captcha',
}

export const QUERY_METRIC: IStringObject = {
  PAGE_VIEWS: 'page_views',
  UNIQUE_PAGE_VIEWS: 'unique_page_views',
  ONLINE_USERS: 'online_users',
  CUSTOM_EVENTS: 'custom_events',
}

export const QUERY_CONDITION: IStringObject = {
  GREATER_THAN: 'greater_than',
  GREATER_EQUAL_THAN: 'greater_equal_than',
  LESS_THAN: 'less_than',
  LESS_EQUAL_THAN: 'less_equal_than',
}

export const QUERY_TIME: IStringObject = {
  LAST_15_MINUTES: 'last_15_minutes',
  LAST_30_MINUTES: 'last_30_minutes',
  LAST_1_HOUR: 'last_1_hour',
  LAST_4_HOURS: 'last_4_hours',
  LAST_24_HOURS: 'last_24_hours',
  LAST_48_HOURS: 'last_48_hours',
}

export const INVITATION_EXPIRES_IN: number = 48 // hours
export const ENTRIES_PER_PAGE_DASHBOARD: number = 11

export const THEME_TYPE: IStringObject = {
  classic: 'classic',
  christmas: 'christmas',
}

export const DEFAULT_ALERTS_TAKE: number = 100

const EUR = {
  symbol: '€',
  code: 'EUR',
}

const USD = {
  symbol: '$',
  code: 'USD',
}

const GBP = {
  symbol: '£',
  code: 'GBP',
}

type ICurrencies = {
  [key in 'EUR' | 'USD' | 'GBP']: {
    symbol: string
    code: string
  }
}

export const CURRENCIES: ICurrencies = {
  EUR, USD, GBP,
}

export const MERCHANT_FEE = '5% + 50¢'

// Paddle fee is 5% + 50¢
const calculatePriceAfterFees = (price: number): number => {
  const fee = 0.05 * price + 0.5
  return price - fee
}

export const calculateReferralCut = (originalTierPrice: number): number => {
  const priceAfterFees = calculatePriceAfterFees(originalTierPrice)
  const referralCut = REFERRAL_CUT * priceAfterFees
  return referralCut
}

export const BillingFrequency = {
  monthly: 'monthly',
  yearly: 'yearly',
}

// TODO: Eventually this should be fetched from the API, e.g. GET /config route
export const PLAN_LIMITS = {
  none: {
    index: 0, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'none',
    monthlyUsageLimit: 0,
    legacy: false,
    price: {
      USD: {
        monthly: 0,
        yearly: 0,
      },
      EUR: {
        monthly: 0,
        yearly: 0,
      },
      GBP: {
        monthly: 0,
        yearly: 0,
      },
    },
  },
  free: {
    index: 0, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'free',
    monthlyUsageLimit: 5000,
    legacy: true,
    price: {
      USD: {
        monthly: 0,
        yearly: 0,
      },
      EUR: {
        monthly: 0,
        yearly: 0,
      },
      GBP: {
        monthly: 0,
        yearly: 0,
      },
    },
  },
  trial: {
    index: 0, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'trial',
    monthlyUsageLimit: 100000,
    legacy: false,
    price: {
      USD: {
        monthly: 0,
        yearly: 0,
      },
      EUR: {
        monthly: 0,
        yearly: 0,
      },
      GBP: {
        monthly: 0,
        yearly: 0,
      },
    },
  },
  hobby: {
    index: 1, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'hobby',
    monthlyUsageLimit: 10000,
    legacy: false,
    price: {
      USD: {
        monthly: 5,
        yearly: 50,
      },
      EUR: {
        monthly: 5,
        yearly: 50,
      },
      GBP: {
        monthly: 4,
        yearly: 40,
      },
    },
    pid: 813694, // Plan ID
    ypid: 813695, // Plan ID - Yearly billing
  },
  freelancer: {
    index: 2, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'freelancer',
    monthlyUsageLimit: 100000,
    legacy: false,
    price: {
      USD: {
        monthly: 15,
        yearly: 150,
      },
      EUR: {
        monthly: 15,
        yearly: 150,
      },
      GBP: {
        monthly: 14,
        yearly: 140,
      },
    },
    pid: 752316, // Plan ID
    ypid: 776469, // Plan ID - Yearly billing
  },
  '200k': {
    index: 3, // 'downgrade' or 'upgrade' logic depends on this
    planCode: '200k',
    monthlyUsageLimit: 200000,
    legacy: false,
    price: {
      USD: {
        monthly: 25,
        yearly: 250,
      },
      EUR: {
        monthly: 25,
        yearly: 250,
      },
      GBP: {
        monthly: 23,
        yearly: 230,
      },
    },
    pid: 854654, // Plan ID
    ypid: 854655, // Plan ID - Yearly billing
  },
  '500k': {
    index: 4, // 'downgrade' or 'upgrade' logic depends on this
    planCode: '500k',
    monthlyUsageLimit: 500000,
    legacy: false,
    price: {
      USD: {
        monthly: 45,
        yearly: 450,
      },
      EUR: {
        monthly: 45,
        yearly: 450,
      },
      GBP: {
        monthly: 40,
        yearly: 400,
      },
    },
    pid: 854656, // Plan ID
    ypid: 854657, // Plan ID - Yearly billing
  },
  startup: {
    index: 5, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'startup',
    monthlyUsageLimit: 1000000,
    legacy: false,
    price: {
      USD: {
        monthly: 59,
        yearly: 590,
      },
      EUR: {
        monthly: 57,
        yearly: 570,
      },
      GBP: {
        monthly: 49,
        yearly: 490,
      },
    },
    pid: 752317,
    ypid: 776470,
  },
  '2m': {
    index: 6, // 'downgrade' or 'upgrade' logic depends on this
    planCode: '2m',
    monthlyUsageLimit: 2000000,
    legacy: false,
    price: {
      USD: {
        monthly: 84,
        yearly: 840,
      },
      EUR: {
        monthly: 84,
        yearly: 840,
      },
      GBP: {
        monthly: 74,
        yearly: 740,
      },
    },
    pid: 854663,
    ypid: 854664,
  },
  enterprise: {
    index: 7, // 'downgrade' or 'upgrade' logic depends on this
    planCode: 'enterprise',
    monthlyUsageLimit: 5000000,
    legacy: false,
    price: {
      USD: {
        monthly: 110,
        yearly: 1100,
      },
      EUR: {
        monthly: 110,
        yearly: 1100,
      },
      GBP: {
        monthly: 95,
        yearly: 950,
      },
    },
    pid: 752318,
    ypid: 776471,
  },
  '10m': {
    index: 8, // 'downgrade' or 'upgrade' logic depends on this
    planCode: '10m',
    monthlyUsageLimit: 10000000,
    legacy: false,
    price: {
      USD: {
        monthly: 150,
        yearly: 1500,
      },
      EUR: {
        monthly: 150,
        yearly: 1500,
      },
      GBP: {
        monthly: 130,
        yearly: 1300,
      },
    },
    pid: 854665,
    ypid: 854666,
  },
}

export const STANDARD_PLANS = ['hobby', 'freelancer', '200k', '500k', 'startup', '2m', 'enterprise', '10m']

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
})
