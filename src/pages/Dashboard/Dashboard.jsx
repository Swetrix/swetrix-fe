import React, { memo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import cx from 'classnames'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import { EyeIcon } from '@heroicons/react/outline'
// import { ChartBarIcon } from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/outline'
import { ArrowSmUpIcon } from '@heroicons/react/solid'
import { ArrowSmDownIcon } from '@heroicons/react/solid'
import { XCircleIcon } from '@heroicons/react/solid'

import Modal from 'ui/Modal'
import Title from 'components/Title'
import Loader from 'ui/Loader'
import { ActivePin, InactivePin } from 'ui/Pin'
import routes from 'routes'

const ProjectCart = ({ name, url, created, active, overall }) => {
  const statsDidGrowUp = overall.percChange >= 0

  return (
    <li>
      <Link to={url} className='block hover:bg-gray-50'>
        <div className='px-4 py-4 sm:px-6'>
          <div className='flex items-center justify-between'>
            <p className='text-lg font-medium text-indigo-600 truncate'>
              {name}
            </p>
            <div className='ml-2 flex-shrink-0 flex'>
              {active ? (
                <ActivePin label='Active' />
              ) : (
                <InactivePin label='Disabled' />
              )}
            </div>
          </div>
          <div className='mt-2 sm:flex sm:justify-between'>
            <div className='sm:flex flex-col'>
              <div className='flex items-center mt-2 text-sm text-gray-500'>
                <EyeIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                Pageviews:&nbsp;
                <dd className='flex items-baseline'>
                  <p className='h-5 mr-1 text-gray-500'>
                    {overall.thisWeek}
                  </p>
                  <p className={cx('flex text-xs -ml-1 items-baseline', {
                    'text-green-600': statsDidGrowUp,
                    'text-red-600': !statsDidGrowUp,
                  })}>
                    {statsDidGrowUp ? (
                      <>
                        <ArrowSmUpIcon className='self-center flex-shrink-0 h-4 w-4 text-green-500' />
                        <span className='sr-only'>
                          Increased by
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowSmDownIcon className='self-center flex-shrink-0 h-4 w-4 text-red-500' />
                        <span className='sr-only'>
                          Descreased by
                        </span>
                      </>
                    )}
                    {overall.percChange}%
                    </p>
                </dd>
              </div>
              {/* <p className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
                <ChartBarIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                Average load time
              </p> */}
            </div>
            <div className='mt-2 flex items-center text-sm text-gray-500'>
              <CalendarIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
              <p>
                Created at <time dateTime={dayjs(created).format('YYYY-MM-DD')}>{dayjs(created).format('MMMM D, YYYY')}</time>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

const NoProjects = () => (
  <div className='mt-5'>
    <h3 className='text-center'>
      You have not yet created any projects
    </h3>
    <p className='text-center'>
      Create a new project here to start using our service
    </p>
  </div>
)

const Dashboard = ({ projects, isLoading, error, user }) => {
  const [showActivateEmailModal, setShowActivateEmailModal] = useState(false)
  const history = useHistory()

  const onNewProject = () => {
    if (user.isActive) {
      history.push(routes.new_project)
    } else {
      setShowActivateEmailModal(true)
    }
  }

  if (error && !isLoading) {
    return (
      <Title title='Dashboard'>
        <div className='flex justify-center pt-10'>
          <div className='rounded-md bg-red-50 p-4 w-11/12 lg:w-4/6'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>{error}</h3>
              </div>
            </div>
          </div>
        </div>
      </Title>
    )
  }

  if (!isLoading) {
    return (
      <Title title='Dashboard'>
        <div className='min-h-min-footer bg-gray-50 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl w-full mx-auto'>
            <div className='flex justify-between'>
              <h2 className='mt-2 text-3xl font-extrabold text-gray-900'>Dashboard</h2>
              <span onClick={onNewProject} className='inline-flex cursor-pointer items-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm'>
                New project
              </span>
            </div>
            {_isEmpty(projects) ? (
              <NoProjects />
            ) : (
              <div className='bg-white shadow overflow-hidden sm:rounded-md mt-10'>
                <ul className='divide-y divide-gray-200'>
                  {_map(projects, ({ name, id, created, active, overall }) => (
                    <ProjectCart key={id} name={name} created={created} active={active} overall={overall} url={routes.project.replace(':id', id)} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Modal
          onClose={() => setShowActivateEmailModal(false)}
          onSubmit={() => setShowActivateEmailModal(false)}
          submitText='Got it'
          title='Please, verify the email address first'
          type='info'
          message={'To start using our service and creating your projects, you first need to confirm your email address.\n\nA link to confirm your account was sent to the email address you provided during registration, if it was not delivered - you can request the link again in your account settings.'}
          isOpened={showActivateEmailModal}
        />
      </Title>
    )
  }

  return (
    <Title title='Dashboard'>
      <div className='min-h-min-footer'>
        <Loader />
      </div>
    </Title>
  )
}

Dashboard.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

Dashboard.defaultProps = {
  error: '',
}

export default memo(Dashboard)
