"use client"
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react';
import {User} from'next-auth'
import { Button } from './ui/button';
const Navbar = () => {

    const {data:session}= useSession()
    const user :User = session?.user as User;
  return (
    <nav className='bg-black md:p-6 shadow-2xl  text-white '>
      <div className='container flex flex-col md:flex-row justify-between items-center'>
        <a href="/" className='text-xl font-bold mb-4 md:mb-0'>FeedbackG</a>
        
        {
            session ? (
                <>
                <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                <div className='flex gap-x-3.5 mb-2 '>
                <Link href='/dashboard'>
                    <Button className='w-full  md:w-auto md:mr-4 mt-2' >Dasboard</Button>
                </Link>
                <Button className='w-full mt-2 md:w-auto' onClick={()=>signOut()}>Logout</Button>
                </div>
                </>
                
            ) : (
                <Link href='/signin'>
                    <Button className='w-full  md:w-auto' >Login</Button>
                </Link>
            )
        }
      </div>
    </nav>
  )
}

export default Navbar
