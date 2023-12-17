import React from 'react'
import _map from 'lodash/map'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ISession } from '../interfaces/session'
import { Badge } from 'ui/Badge'

interface ISessions {
  sessions: ISession[]
  onClick: (psid: string) => void
}

interface ISessionComponent {
  session: ISession
  onClick: (psid: string) => void
}

const Session = ({ session, onClick }: ISessionComponent) => {
  return (
    <li
      className='relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50 hover:bg-gray-200 cursor-pointer sm:px-6 lg:px-8'
      onClick={() => onClick(session.psid)}
    >
      <div className='flex min-w-0 gap-x-4'>
        <div className='min-w-0 flex-auto'>
          <p className='text-sm font-semibold leading-6 text-gray-900'>
            {session.psid}
            |
            {session.created}
          </p>
          <p className='mt-1 flex text-xs leading-5 text-gray-500'>
            {session.cc}
            |
            {session.os}
            |
            {session.br}
          </p>
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-x-4'>
        <div className='hidden sm:flex sm:flex-col sm:items-end'>
          <p className='text-sm leading-6 text-gray-900'>
            {`${session.pageviews} pageviews`}
          </p>
          {/* {person.lastSeen ? (
            <p className='mt-1 text-xs leading-5 text-gray-500'>
              Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
            </p>
          ) : (
            <div className='mt-1 flex items-center gap-x-1.5'>
              <div className='flex-none rounded-full bg-emerald-500/20 p-1'>
                <div className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              </div>
              <p className='text-xs leading-5 text-gray-500'>Online</p>
            </div>
          )} */}
          {/* TODO: Last seen | Active badge */}
          <Badge label='Active' colour='green' />
        </div>
        <ChevronRightIcon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
      </div>
    </li>
  )
}

export const Sessions: React.FC<ISessions> = ({ sessions, onClick }) => {
  console.log('Sessions:', sessions)

  return (
    <ul className='divide-y divide-gray-100'>
      {_map(sessions, (session) => (
        <Session key={session.psid} session={session} onClick={onClick} />
      ))}
    </ul>
  )
}
