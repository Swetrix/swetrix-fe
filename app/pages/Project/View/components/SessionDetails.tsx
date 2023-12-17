import React from 'react'
import { ISessionDetails } from '../interfaces/session'

interface ISessionDetailsComponent {
  details: ISessionDetails
  psid: string
}

export const SessionDetails = ({ details, psid }: ISessionDetailsComponent) => {
  return (
    <div className='relative bg-white dark:bg-slate-800/25 dark:border dark:border-slate-800/50 pt-5 px-4 min-h-72 max-h-96 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden'>
      {psid}
      <br />
      Geo: {details.cc} | {details.rg} | {details.ct}
      <br />
      OS: {details.os}
      <br />
      Device: {details.dv}
      <br />
      Browser: {details.br}
      <br />
      Language: {details.lc}
      <br />
      Referrer: {details.ref}
      <br />
      UTM: {details.so} | {details.me} | {details.ca}
      <br />
      Duration: {details.sdur}
    </div>
  )
}
