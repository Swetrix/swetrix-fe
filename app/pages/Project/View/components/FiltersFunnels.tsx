import React, { memo } from 'react'
import _truncate from 'lodash/truncate'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import countries from 'utils/isoCountries'

/**
 * This component is used for showing the filter in panel
 * @returns {JSX.Element}
 */
const Filter = ({
  filter, onRemoveFilter, language, t,
}: {
  filter: string
  // eslint-disable-next-line no-shadow
  onRemoveFilter: (filter: string) => void
  language: string
  t: (key: string) => string
}): JSX.Element => {
  const displayFilter = _truncate(countries.getName(filter, language))

  return (
    <span className='inline-flex rounded-md items-center py-0.5 pl-2.5 pr-1 mr-2 mt-2 text-sm font-medium bg-gray-200 text-gray-800 dark:text-gray-50 dark:bg-slate-800'>
      {t('project.mapping.cc')}
      &nbsp;
      &quot;
      {displayFilter}
      &quot;
      <button
        onClick={() => onRemoveFilter(filter)}
        type='button'
        className='flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-800 hover:text-gray-900 hover:bg-gray-300 focus:bg-gray-300 focus:text-gray-900 dark:text-gray-50 dark:bg-slate-800 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:focus:text-gray-300 focus:outline-none '
      >
        <span className='sr-only'>Remove filter</span>
        <svg className='h-2 w-2' stroke='currentColor' fill='none' viewBox='0 0 8 8'>
          <path strokeLinecap='round' strokeWidth='1.5' d='M1 1l6 6m0-6L1 7' />
        </svg>
      </button>
    </span>
  )
}

/**
 * This component is used for rendering the filter panel.
 *
 * @param {array} filters - Active filters.
 * @param {function} onRemoveFilter - Callback to remove a filter.
 * @param {function} onChangeExclusive - Callback to change the exclusive status of a filter.
 * @param {object} tnMapping - Mapping of column names to translated names.
 * @returns {JSX.Element}
 */
const FiltersFunnels = ({
  filters, onRemoveFilter,
}: {
  filters: string[]
  // eslint-disable-next-line no-shadow
  onRemoveFilter: (filter: string) => void
}) => {
  const { t, i18n: { language } } = useTranslation('common')

  return (
    <div className='flex justify-center md:justify-start flex-wrap -mt-2'>
      {_map(filters, (props) => (
        <Filter key={props} onRemoveFilter={onRemoveFilter} language={language} t={t} filter={props} />
      ))}
    </div>
  )
}

FiltersFunnels.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    column: PropTypes.string,
    filter: PropTypes.string,
    isExclusive: PropTypes.bool,
  })),
  onRemoveFilter: PropTypes.func.isRequired,
}

FiltersFunnels.defaultProps = {
  filters: [],
}

export default memo(FiltersFunnels)
