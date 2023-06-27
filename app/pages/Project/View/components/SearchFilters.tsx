import React, { useState, useEffect, useMemo } from 'react'

import _some from 'lodash/some'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'
import _includes from 'lodash/includes'
import countries from 'utils/isoCountries'

import Modal from 'ui/Modal'
import MultiSelect from 'ui/MultiSelect'
import Dropdown from 'ui/Dropdown'
import { FILTERS_PANELS_ORDER } from 'redux/constants'

import { getFilters } from 'api'

import CCRow from './CCRow'

const SearchFilters = ({
  t, setProjectFilter, pid, showModal, setShowModal, language,
}: {
  t: (key: string) => string,
  setProjectFilter: (filter: {
    column: string
    filter: string[]
  }[]) => void
  pid: string
  showModal: boolean
  setShowModal: (show: boolean) => void
  language: string
}) => {
  const [filterType, setFilterType] = useState<string>('')
  const [searchList, setSearchList] = useState<string[]>([])
  const [filterList, setFilterList] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<{
    column: string
    filter: string[]
  }[]>([])
  const filters: string[] = useMemo(() => {
    let filtersArray: string[] = []
    _forEach(activeFilter, (item) => {
      filtersArray = [...filtersArray, ...item.filter]
    })
    return filtersArray
  }, [activeFilter])

  const getFiltersList = async () => {
    if (!_isEmpty(filterType)) {
      const res = await getFilters(pid, filterType)
      setFilterList(res)
      setSearchList(res)
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
      title={t('project.advancedFilters')}
      message={
        (
          <div className='min-h-[410px]'>
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
                items={searchList}
                  // eslint-disable-next-line react/no-unstable-nested-components
                itemExtractor={(item) => {
                  if (filterType === 'cc') {
                    return <CCRow cc={item} language={language} />
                  }
                  return item
                }}
                  // eslint-disable-next-line react/no-unstable-nested-components
                labelExtractor={(item) => {
                  if (filterType === 'cc' || countries.getName(item, language)) {
                    return <CCRow cc={item} language={language} />
                  }
                  return item
                }}
                keyExtractor={(item) => item}
                label={filters}
                placholder={t('project.settings.reseted.filtersPlaceholder')}
                searchPlaseholder={t('project.search')}
                onSearch={(search: string) => {
                  if (search.length > 0) {
                    if (filterType === 'cc') {
                      setSearchList(_filter(filterList, (item) => _includes(countries.getName(item, language), search)))
                      return
                    }

                    setSearchList(_filter(filterList, (item) => _includes(item, search)))
                  } else {
                    setSearchList(filterList)
                  }
                }}
                onSelect={(item: string) => setActiveFilter((oldItems: {
                    column: string
                    filter: string[]
                  }[]) => {
                  if (_some(oldItems, (i) => i?.column === filterType)) {
                    if (_some(oldItems, (i) => i?.column === filterType && _includes(i?.filter, item))) {
                      return _filter(oldItems, (i) => i.column !== filterType).concat({
                        column: filterType,
                        filter: _filter(_find(oldItems, (i) => i.column === filterType)?.filter || [], (i) => i !== item),
                      })
                    }

                    return _filter(oldItems, (i) => i?.column !== filterType).concat({
                      column: filterType,
                      filter: [..._find(oldItems, (i) => i?.column === filterType)?.filter || [], item],
                    })
                  }

                  return oldItems.concat({
                    column: filterType,
                    filter: [item],
                  })
                })}
                onRemove={(item: string) => setActiveFilter((oldItems: {
                    column: string
                    filter: string[]
                  }[]) => {
                  if (_some(oldItems, (i) => i.column === filterType)) {
                    return _filter(oldItems, (i) => i.column !== filterType).concat({
                      column: filterType,
                      filter: _filter(_find(oldItems, (i) => i.column === filterType)?.filter || [], (i) => i !== item),
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
        )
      }
      submitType='regular'
      isOpened={showModal}
    />
  )
}

export default SearchFilters
