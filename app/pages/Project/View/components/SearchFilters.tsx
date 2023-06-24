import React, { useState, useEffect } from 'react'

import _isEmpty from 'lodash/isEmpty'
import _includes from 'lodash/includes'
import _filter from 'lodash/filter'

import Modal from 'ui/Modal'
import MultiSelect from 'ui/MultiSelect'
import Dropdown from 'ui/Dropdown'
import { FILTERS_PANELS_ORDER } from 'redux/constants'

import { getFilters } from 'api'

const SearchFilters = ({
  t, setProjectFilter, pid, showModal, setShowModal,
}: {
  t: (key: string) => string,
  setProjectFilter: (filter: string[]) => void
  pid: string
  showModal: boolean
  setShowModal: (show: boolean) => void
}) => {
  const [filterType, setFilterType] = useState<string>('')
  const [filterList, setFilterList] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string[]>([])

  const getFiltersList = async () => {
    if (!_isEmpty(filterType)) {
      const res = await getFilters(pid, filterType)
      setFilterList(res)
    }
  }

  useEffect(() => {
    getFiltersList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType])

  return (
    <Modal
      onClose={() => setShowModal(false)}
      onSubmit={() => {
        setProjectFilter(activeFilter)
        setShowModal(false)
      }}
      size='large'
      submitText={t('project.settings.reset')}
      closeText={t('common.close')}
      title={t('project.settings.qReset')}
      message={
        (
          <div className='min-h-[410px]'>
            <p className='text-gray-500 dark:text-gray-300 italic mt-4 mb-4 text-sm'>
              {t('project.settings.reseted.viaFiltersHint')}
            </p>
            <div>
              <Dropdown
                className='min-w-[160px]'
                title={!_isEmpty(filterType) ? t(`project.mapping.${filterType}`) : t('project.settings.reseted.selectFilters')}
                items={FILTERS_PANELS_ORDER}
                labelExtractor={(item) => t(`project.mapping.${item}`)}
                keyExtractor={(item) => item}
                onSelect={(item) => setFilterType(item)}
              />
              <div className='h-2' />
              {(filterType && !_isEmpty(filterList)) ? (
                <MultiSelect
                  className='w-full max-w-[400px]'
                  items={filterList}
                  labelExtractor={(item) => item}
                  keyExtractor={(item) => item}
                  label={activeFilter}
                  placholder={t('project.settings.reseted.filtersPlaceholder')}
                  onSelect={(item: string) => setActiveFilter((oldItems: string[]) => {
                    if (_includes(oldItems, item)) {
                      return _filter(oldItems, (i) => i !== item)
                    }
                    return [...oldItems, item]
                  })}
                  onRemove={(item: string) => setActiveFilter((oldItems: string[]) => _filter(oldItems, (i) => i !== item))}
                />
              ) : (
                <p className='text-gray-500 dark:text-gray-300 italic mt-4 mb-4 text-sm'>
                  {t('project.settings.reseted.noFilters')}
                </p>
              )}
            </div>
          </div>
        )
      }
      submitType='danger'
      type='error'
      isOpened={showModal}
    />
  )
}

export default SearchFilters
