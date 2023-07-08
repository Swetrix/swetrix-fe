import React from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'

interface ISpin {
  className?: string,
  alwaysLight?: boolean,
}

const Spin = ({ className, alwaysLight }: ISpin): JSX.Element => (
  <svg
    className={cx('animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900 dark:text-white', {
      'text-slate-900 dark:text-white': !alwaysLight,
      'text-white': alwaysLight,
    }, className)}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
  </svg>
)

Spin.propTypes = {
  className: PropTypes.string,
  alwaysLight: PropTypes.bool,
}

Spin.defaultProps = {
  className: '',
  alwaysLight: false,
}

export default Spin
