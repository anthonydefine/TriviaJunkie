import React from 'react'
import { Link } from 'react-router-dom'

export const Topbar = () => {
  return (
    <section className='sticky top-0 hidden z-50 w-full'>
      <div>
        <Link>
          <h1>Home</h1>
        </Link>
      </div>
    </section>
  )
}
