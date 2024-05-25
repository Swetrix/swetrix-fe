import React from 'react'
import cx from 'clsx'

interface IRobot {
  className?: string
  containerClassName?: string
  theme: 'dark' | 'light'
}

const Robot: React.FC<IRobot> = ({ className, containerClassName, theme }): JSX.Element => {
  const cn = cx(className, {
    'fill-text-gray-700': theme === 'dark',
    'fill-white': theme === 'light',
  })

  return (
    <svg
      className={containerClassName}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='11' width='18' height='10' rx='2' className={cn} />
      <circle cx='12' cy='5' r='2' className={cn} />
      <path d='M12 7v4' className={cn} />
      <line x1='8' y1='16' x2='8' y2='16' className={cn} />
      <line x1='16' y1='16' x2='16' y2='16' className={cn} />
    </svg>
  )
}

export default Robot
