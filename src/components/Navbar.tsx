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
    <nav className='bg-black md:p-6 shadow-2xl rounded-full text-white ml-1 mr-1 md:ml-[20%] md:mr-[20%] mt-2'>
      <div className='container flex flex-col md:flex-row justify-between items-center'>
        <a href="#" className='text-xl font-bold mb-4 md:mb-0'>FeedbackG</a>
        {
            session ? (
                <>
                <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button></>
                
            ) : (
                <Link href='/signin'>
                    <Button className='w-full md:w-auto' >Login</Button>
                </Link>
            )
        }
      </div>
    </nav>
  )
}

export default Navbar
