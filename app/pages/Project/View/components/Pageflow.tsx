import React from 'react'
import { NewspaperIcon } from '@heroicons/react/24/outline'
import _map from 'lodash/map'

interface IPageflow {
  pages: {
    value: string
    created: string
  }[]
}

export const Pageflow = ({ pages }: IPageflow) => {
  return (
    <div className='flow-root'>
      <ul className='-mb-8'>
        {_map(pages, ({ value, created }, index) => (
          <li key={`${value}${created}`}>
            <div className='relative pb-8'>
              {index !== pages.length - 1 ? (
                <span className='absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200' aria-hidden='true' />
              ) : null}
              <div className='relative flex space-x-3'>
                <div>
                  <span
                    className='h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-400'
                  >
                    <NewspaperIcon className='h-5 w-5 text-white' aria-hidden='true' />
                  </span>
                </div>
                <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Pageview
                      <span className='font-medium text-gray-900'>
                        {value}
                      </span>
                    </p>
                  </div>
                  <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                    <time dateTime={created}>{created}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}