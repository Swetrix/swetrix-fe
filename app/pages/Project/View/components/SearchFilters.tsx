import React, { useState, useEffect } from 'react'

import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
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
  setProjectFilter: (filter: {
    column: string
    filter: string
  }[]) => void
  pid: string
  showModal: boolean
  setShowModal: (show: boolean) => void
}) => {
  const [filterType, setFilterType] = useState<string>('')
  const [filterList, setFilterList] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<{
    column: string
    filter: string
  }[]>([])

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
      submitText={t('project.applyFilters')}
      closeText={t('common.close')}
      title={t('project.searchFilters')}
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
                  className='max-w-max'
                  items={filterList}
                  labelExtractor={(item: {
                    filter: string
                  }) => item.filter}
                  keyExtractor={(item: {
                    filter: string
                  }) => item.filter}
                  label={activeFilter}
                  placholder={t('project.settings.reseted.filtersPlaceholder')}
                  onSelect={(item: string) => setActiveFilter((oldItems: {
                    column: string
                    filter: string
                  }[]) => {
                    if (_find(oldItems, (i) => i.filter === item)) {
                      return _filter(oldItems, (i) => {
                        return i.filter !== item
                      })
                    }

                    return [...oldItems, {
                      column: filterType,
                      filter: item,
                    }]
                  })}
                  onRemove={(item: {
                    column: string
                    filter: string
                  }) => setActiveFilter((oldItems: {
                    column: string
                    filter: string
                  }[]) => {
                    if (_find(oldItems, (i) => i.filter === item.filter)) {
                      return _filter(oldItems, (i) => {
                        return i.filter !== item.filter
                      })
                    }

                    return oldItems
                  })}
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
      submitType='regular'
      type='info'
      isOpened={showModal}
    />
  )
}

export default SearchFilters
