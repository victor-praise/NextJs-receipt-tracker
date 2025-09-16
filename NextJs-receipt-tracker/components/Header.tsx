"use client";
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation';

function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';


  return (
    <div className={`flex items-center justify-between p-4 ${isHomePage ? "bg-blue-50" : "bg-white border-b border-blue-50"}`} >
        <Link href="/" className='flex items-center'>
      <Shield className='w-6 h-6 text-blue-600 mr-2'/>

      <h1 className='text-xl font-semibold'>Securio</h1>
    </Link>

    <div className='flex items-center space-x-4'>
           <SignedIn>
        <Link href="/receipts">
        <Button variant="outline">My Receipts</Button>
        </Link>
        <Link href="/manage-plan">
        <Button>Manage Plan</Button>
        </Link>
            <UserButton/>
            </SignedIn>

            <SignedOut>
                <SignInButton mode='modal'>
                <Button variant="outline">Login</Button>
                </SignInButton>
            </SignedOut>       
    </div>
    </div>

 

  )
}

export default Header