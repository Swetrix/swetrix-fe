import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import _includes from 'lodash/includes'

import { isSelfhosted } from 'redux/constants'
import routes from 'routes'

const selfHostedBlacklist = [
  routes.signup, routes.reset_password, routes.new_password_form, routes.main, routes.user_settings, routes.verify, routes.change_email,
]

const DEFAULT_PAGE = routes.signin

const Selfhosted = ({ children }) => {
  const history = useHistory()

  useEffect(() => {
    if (isSelfhosted) {
      if (_includes(selfHostedBlacklist, window.location.pathname)) {
        history.push(DEFAULT_PAGE)
      }
  
      const unlisten = history.listen(({ pathname }) => {
        if (_includes(selfHostedBlacklist, pathname)) {
          history.push(DEFAULT_PAGE)
        }
      })
      return unlisten
    }
  }, [history])

  return <>{children}</>
}

export default Selfhosted
