import React from 'react'
import { Topbar } from '../components/Topbar'
import LeftSidebar from '../components/LeftSidebar'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <Topbar />
      <LeftSidebar />

      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
    </div>
  )
}

export default RootLayout