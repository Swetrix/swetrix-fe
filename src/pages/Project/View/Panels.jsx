import React, { memo, useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid'
import { FilterIcon } from '@heroicons/react/outline'
import cx from 'clsx'
import PropTypes from 'prop-types'
import _keys from 'lodash/keys'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _isFunction from 'lodash/isFunction'
import _reduce from 'lodash/reduce'
import _round from 'lodash/round'
import _floor from 'lodash/floor'
import _size from 'lodash/size'
import _slice from 'lodash/slice'
import _sum from 'lodash/sum'
import InteractiveMap from './InteractiveMap'
import Progress from 'ui/Progress'
import PulsatingCircle from 'ui/icons/PulsatingCircle'
import ModalMap from 'ui/ModalMap'
import {pie} from "billboard.js"
import Chart from 'ui/Chart'

const ENTRIES_PER_PANEL = 5

// noSwitch - 'previous' and 'next' buttons
const PanelContainer = ({
  name,
  children,
  noSwitch,
  icon,
  type,
  showFragment,
  fragment,
  openModal,
}) => (
  <div
    className={cx(
      "relative bg-white dark:bg-gray-750 pt-5 px-4 min-h-72 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden",
      {
        "pb-12": !noSwitch,
        "pb-5": noSwitch,
      }
    )}
  >
    <div className="flex items-center justify-between">
      <h3 className="flex items-center text-lg leading-6 font-semibold mb-2 text-gray-900 dark:text-gray-50">
        {icon && (
          <>
            {icon}
            &nbsp;
          </>
        )}
        {name}
      </h3>
      {type === "cc" &&
        (!fragment ? (
          <button
            className=" mb-2 bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
            onClick={showFragment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center">
            <button
              className=" mb-2 bg-transparent hover:bg-blue-500 text-blue-400 text-ms hover:text-white px-2 border border-blue-500 hover:border-transparent rounded mr-2"
              onClick={openModal}
            >
              Open map
            </button>
            <button
              className=" mb-2 bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
              onClick={showFragment}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                />
              </svg>
            </button>
          </div>
        ))}
      { type !== "cc" &&
        type &&
        type !== "me" &&
        type !== "ca" &&
        (!fragment ? (
          <button
            className=" mb-2 bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
            onClick={showFragment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>
        ) : (
          <div>
            <button
              className=" mb-2 bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
              onClick={showFragment}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                />
              </svg>
            </button>
          </div>
        ))}
    </div>
    <div className="flex flex-col h-full scroll-auto">{children}</div>
  </div>
);

PanelContainer.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  noSwitch: PropTypes.bool,
  icon: PropTypes.node,
}

PanelContainer.defaultProps = {
  icon: null,
  noSwitch: false,
}

const Overview = ({
  overall, chartData, activePeriod, t, live,
}) => {
  const pageviewsDidGrowUp = overall.percChange >= 0
  const uniqueDidGrowUp = overall.percChangeUnique >= 0
  const pageviews = _sum(chartData?.visits) || 0
  const uniques = _sum(chartData?.uniques) || 0
  let bounceRate = 0

  if (pageviews > 0) {
    bounceRate = _round(uniques * 100 / pageviews, 1)
  }

  return (
    <PanelContainer name={t('project.overview')} noSwitch>
      <div className='flex text-lg justify-between'>
        <div className='flex items-center dark:text-gray-50'>
          <PulsatingCircle className='mr-1.5' type='big' />
          {t('dashboard.liveVisitors')}
          :
        </div>
        <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-xl'>
          {live}
        </p>
      </div>
      {!_isEmpty(chartData) && (
        <>
          <p className='text-lg font-semibold dark:text-gray-50'>
            {t('project.statsFor')}
            <span className='lowercase'> {activePeriod.label}</span>
          </p>

          <div className='flex justify-between'>
            <p className='text-lg dark:text-gray-50'>
              {t('dashboard.pageviews')}
              :
            </p>
            <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-xl'>
              {pageviews}
            </p>
          </div>

          <div className='flex justify-between'>
            <p className='text-lg dark:text-gray-50'>
              {t('dashboard.unique')}
              :
            </p>
            <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-xl'>
              {uniques}
            </p>
          </div>

          <div className='flex justify-between'>
            <p className='text-lg dark:text-gray-50'>
              {t('dashboard.bounceRate')}
              :
            </p>
            <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-xl'>
              {bounceRate}
              %
            </p>
          </div>
          <hr className='my-2' />
        </>
      )}
      <p className='text-lg font-semibold dark:text-gray-50'>
        {t('project.weeklyStats')}
      </p>
      <div className='flex justify-between'>
        <p className='text-lg dark:text-gray-50'>
          {t('dashboard.pageviews')}
          :
        </p>
        <dd className='flex items-baseline'>
          <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-lg'>
            {overall.thisWeek}
          </p>
          <p className={cx('flex text-sm -ml-1 items-baseline', {
            'text-green-600': pageviewsDidGrowUp,
            'text-red-600': !pageviewsDidGrowUp,
          })}>
            {pageviewsDidGrowUp ? (
              <>
                <ArrowSmUpIcon className='self-center flex-shrink-0 h-4 w-4 text-green-500' />
                <span className='sr-only'>
                  {t('dashboard.inc')}
                </span>
              </>
            ) : (
              <>
                <ArrowSmDownIcon className='self-center flex-shrink-0 h-4 w-4 text-red-500' />
                <span className='sr-only'>
                  {t('dashboard.dec')}
                </span>
              </>
            )}
            {overall.percChange}%
          </p>
        </dd>
      </div>
      <div className='flex justify-between'>
        <p className='text-lg dark:text-gray-50'>
          {t('dashboard.unique')}
          :
        </p>
        <dd className='flex items-baseline'>
          <p className='h-5 mr-2 text-gray-900 dark:text-gray-50 text-lg'>
            {overall.thisWeekUnique}
          </p>
          <p className={cx('flex text-sm -ml-1 items-baseline', {
            'text-green-600': uniqueDidGrowUp,
            'text-red-600': !uniqueDidGrowUp,
          })}>
            {uniqueDidGrowUp ? (
              <>
                <ArrowSmUpIcon className='self-center flex-shrink-0 h-4 w-4 text-green-500' />
                <span className='sr-only'>
                  {t('dashboard.inc')}
                </span>
              </>
            ) : (
              <>
                <ArrowSmDownIcon className='self-center flex-shrink-0 h-4 w-4 text-red-500' />
                <span className='sr-only'>
                  {t('dashboard.dec')}
                </span>
              </>
            )}
            {overall.percChangeUnique}%
          </p>
        </dd>
      </div>
    </PanelContainer>
  )
}

const CustomEvents = ({
  customs, chartData, t,
}) => {
  const keys = _keys(customs)
  const uniques = _sum(chartData.uniques)

  return (
    <PanelContainer name={t('project.customEv')}>
      <table className='table-fixed'>
        <thead>
          <tr>
            <th className='w-4/6 text-left text-gray-900 dark:text-gray-50'>{t('project.event')}</th>
            <th className='w-1/6 text-right text-gray-900 dark:text-gray-50'>{t('project.quantity')}&nbsp;&nbsp;</th>
            <th className='w-1/6 text-right text-gray-900 dark:text-gray-50'>{t('project.conversion')}</th>
          </tr>
        </thead>
        <tbody>
          {_map(keys, (ev) => (
            <tr key={ev}>
              <td className='text-left'>{ev}</td>
              <td className='text-right'>{customs[ev]}&nbsp;&nbsp;</td>
              <td className='text-right'>{_round((customs[ev] / uniques) * 100, 2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelContainer>
  )
}

CustomEvents.propTypes = {
  customs: PropTypes.objectOf(PropTypes.number).isRequired,
}

const Panel = ({
  name, data, rowMapper, capitalize, linkContent, t, icon, id, hideFilters, onFilter,
}) => {
  const [page, setPage] = useState(0)
  const currentIndex = page * ENTRIES_PER_PANEL
  const keys = useMemo(() => _keys(data).sort((a, b) => data[b] - data[a]), [data])
  const keysToDisplay = useMemo(() => _slice(keys, currentIndex, currentIndex + 5), [keys, currentIndex])
  const total = useMemo(() => _reduce(keys, (prev, curr) => prev + data[curr], 0), [keys]) // eslint-disable-line
  const [fragment, setFragment] = useState(false)
  const [modal, setModal] = useState(false)
  const canGoPrev = () => page > 0
  const canGoNext = () => page < _floor((_size(keys) - 1  ) / ENTRIES_PER_PANEL)
  const _onFilter = hideFilters ? () => { } : onFilter

  useEffect(() => {
    const sizeKeys = _size(keys)

    if (currentIndex > sizeKeys) {
      setPage(_floor(sizeKeys / ENTRIES_PER_PANEL))
    }
  }, [currentIndex, keys])

  const onPrevious = () => {
    if (canGoPrev()) {
      setPage(page - 1)
    }
  }

  const onNext = () => {
    if (canGoNext()) {
      setPage(page + 1)
    }
  }


  if (id === 'cc' && fragment) {
    return (
      <PanelContainer
        name={name}
        icon={icon}
        type={id}
        showFragment={() => setFragment(false)}
        fragment={fragment}
        openModal={() => setModal(true)}
      >
        {_isEmpty(data) ? (
          <p className="mt-1 text-base text-gray-700 dark:text-gray-300">
            {t("project.noParamData")}
          </p>
        ) : (
          <>
            <InteractiveMap
              data={data}
              onClickCountry={(key) => _onFilter(id, key)}
            />
            <ModalMap
            onClose={() => setModal(false)}
            closeText="Close map"
            isOpened={modal}
            >
              <InteractiveMap
                data={data}
                onClickCountry={(key) => _onFilter(id, key)}
              />
            </ModalMap>
          </>
        )}
      </PanelContainer>
    );
  }



  if (fragment) {
    const options = {
      data: {
        columns: _map(data, (e, index) => [index, e]),
        type: pie(),
        // (if you need fillter for onClick, but this fillter have some bugs rerender )
        // onclick: (e) => { _onFilter(id, e.id)}
      },
      legend: {
        show: false,
      },
    };
    return (
      <PanelContainer
        name={name}
        icon={icon}
        type={id}
        showFragment={() => {
          setFragment(false);
        }}
        fragment={fragment}
      >
        {_isEmpty(data) ? (
          <p className="mt-1 text-base text-gray-700 dark:text-gray-300">
            {t("project.noParamData")}
          </p>
        ) : (
          <Chart
            options={options}
            current={`Panels-${id}`}
          />
        )}
      </PanelContainer>
    );
  }

  return (
    <PanelContainer name={name} icon={icon} type={id} showFragment={() => setFragment(true)}>
      {_isEmpty(data) ? (
        <p className='mt-1 text-base text-gray-700 dark:text-gray-300'>
          {t('project.noParamData')}
        </p>
      ) : _map(keysToDisplay, key => {
        const perc = _round(data[key] / total * 100, 2)
        const rowData = _isFunction(rowMapper) ? rowMapper(key) : key

        return (
          <Fragment key={key}>
            <div
              className={cx('flex justify-between mt-1 dark:text-gray-50 rounded', {
                'group hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer': !hideFilters,
              })}
              onClick={() => _onFilter(id, key)}
            >
              {/* TODO: FIX: CLICKING ON AN EXTERNAL LINK CAUSES FILTER TO ACTIVATE */}
              {linkContent ? (
                <a
                  className={cx('flex items-center label hover:underline text-blue-600 dark:text-blue-500', { capitalize })}
                  href={rowData}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {rowData}
                  {!hideFilters && (
                    <FilterIcon className='ml-2 w-4 h-4 text-gray-500 hidden group-hover:block dark:text-gray-300' />
                  )}
                </a>
              ) : (
                <span className={cx('flex items-center label', { capitalize })}>
                  {rowData}
                  {!hideFilters && (
                    <FilterIcon className='ml-2 w-4 h-4 text-gray-500 hidden group-hover:block dark:text-gray-300' />
                  )}
                </span>
              )}
              <span className='ml-3 dark:text-gray-50'>
                {data[key]}
                &nbsp;
                <span className='text-gray-500 dark:text-gray-200 font-light'>({perc}%)</span>
              </span>
            </div>
            <Progress now={perc} />
          </Fragment>
        )
      })}
      {_size(keys) > 5 && (
        <div className='absolute bottom-0 w-card-toggle'>
          <div className='flex justify-between select-none mb-2'>
            <span
              className={cx('text-gray-500 dark:text-gray-200 font-light', {
                hoverable: canGoPrev(),
                disabled: !canGoPrev(),
              })}
              role='button'
              onClick={onPrevious}
            >
              &lt;
              &nbsp;
              {t('project.prev')}
            </span>
            <span
              className={cx('text-gray-500 dark:text-gray-200 font-light', {
                hoverable: canGoNext(),
                disabled: !canGoNext(),
              })}
              role='button'
              onClick={onNext}
            >
              {t('project.next')}
              &nbsp;
              &gt;
            </span>
          </div>
        </div>
      )}
    </PanelContainer>
  )
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.number).isRequired,
  id: PropTypes.string,
  rowMapper: PropTypes.func,
  onFilter: PropTypes.func,
  capitalize: PropTypes.bool,
  linkContent: PropTypes.bool,
  hideFilters: PropTypes.bool,
  icon: PropTypes.node,
}

Panel.defaultProps = {
  id: null,
  rowMapper: null,
  capitalize: false,
  linkContent: false,
  onFilter: () => { },
  hideFilters: false,
  icon: null,
}

const PanelMemo = memo(Panel)
const OverviewMemo = memo(Overview)
const CustomEventsMemo = memo(CustomEvents)

export {
  PanelMemo as Panel,
  OverviewMemo as Overview,
  CustomEventsMemo as CustomEvents,
}
