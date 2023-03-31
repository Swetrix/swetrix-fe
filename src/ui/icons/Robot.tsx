import React from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'

const Robot = ({
  className, containerClassName, // theme,
}: {
  className?: string,
  containerClassName?: string,
}): JSX.Element => {
  const cn = cx(className, {
    // 'fill-white': theme === 'dark',
    // 'fill-slate-800': theme === 'light',
  })

  return (
    <svg className={containerClassName} width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='11' width='18' height='10' rx='2' className={cn} />
      <circle cx='12' cy='5' r='2' className={cn} />
      <path d='M12 7v4' className={cn} />
      <line x1='8' y1='16' x2='8' y2='16' className={cn} />
      <line x1='16' y1='16' x2='16' y2='16' className={cn} />
    </svg>
  )
}

Robot.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  // theme: PropTypes.string.isRequired,
}

Robot.defaultProps = {
  className: '',
  containerClassName: '',
}

export default Robot