import React, { memo } from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'

const Checkbox = ({
  label, hint, id, name, className, onChange, checked, hintClassName, disabled,
}) => {
  const identifier = id || name

  return (
    <div className={cx('relative flex items-start whitespace-pre-line', {
      'cursor-not-allowed': disabled,
    }, className)}
    >
      <div className='flex items-center h-5'>
        <input
          id={identifier}
          aria-describedby={identifier}
          name={name}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className={cx('focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-800 dark:bg-gray-700 dark:checked:bg-indigo-600 rounded cursor-pointer', { 'cursor-not-allowed': disabled, 'opacity-50': disabled })}
        />
      </div>
      <div className='ml-3 text-sm'>
        <label htmlFor={identifier} className={cx('font-medium text-gray-700 dark:text-gray-200 cursor-pointer', { 'cursor-not-allowed': disabled })}>{label}</label>
        {hint && (
          <p id={`${identifier}-description`} className={cx('text-gray-500 dark:text-gray-300', hintClassName)}>{hint}</p>
        )}
      </div>
    </div>
  )
}

Checkbox.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string, PropTypes.node,
  ]),
  checked: PropTypes.bool.isRequired,
  hint: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  hintClassName: PropTypes.string,
  disabled: PropTypes.bool,
}

Checkbox.defaultProps = {
  label: '',
  hint: '',
  onChange: () => { },
  id: '',
  className: '',
  name: '',
  hintClassName: '',
  disabled: false,
}

export default memo(Checkbox)
