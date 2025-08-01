import React from 'react'
import { Link } from 'react-router-dom'
import { PhoneIcon } from '@heroicons/react/16/solid'

const Nav = () => {
  return (
    <>
      <div className='w-full items-center justify-between flex py-7 px-50 mx-auto bg-white'>
        <Link to={`/`} >
          <a href="#">
            <img src='/assets/images/logos/logo.svg' alt="" />
          </a>
        </Link>

        <ul className='flex items-center gap-12 text-xl'>
          <li>
            <Link to={`/`}>
              <a href="#">Browse</a>
            </Link>

          </li>
          <li><a href="#">Popular</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">Event</a></li>
          <li><a href="#">My Booking</a></li>
        </ul>
        <a href="#" className='flex items-center gap-3 border border-black px-7 py-3 rounded-full '>
          <PhoneIcon className='w-7 h-7' />
          <span>Contact Us</span>
        </a>

      </div>
      <div>

      </div>
    </>
  )
}

export default Nav;
