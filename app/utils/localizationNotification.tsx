import _isString from 'lodash/isString'
import _isEmpty from 'lodash/isEmpty'

const localizationNotification = ({
  error, otherMessage,
}: {
  error: {
    message: string
  } | string,
  otherMessage: string
}): string => {
  if (_isEmpty(error)) {
    return otherMessage
  }

  if (_isString(error)) {
    return error
  }

  return error.message
}

export default localizationNotification
