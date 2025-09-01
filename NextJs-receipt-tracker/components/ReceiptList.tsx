'use client'
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react'

function ReceiptList() {
    const {user} = useUser();
    const receipts = useQuery(api.receipts.getReceipt,{ userId:user?.id || ""});

    if(!user){
        return <div className="w-full p-8 text-center">
            <p className='mt-2 text-gray-600'>Please sign in to view your receipts.</p>
        </div>
    }

    if(!receipts){
        <div className="w-full p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto">
               
            </div>
             <p className='mt-2 text-gray-600'>Loading receipts...</p>
        </div>
    }

    if(receipts && receipts.length === 0){
        return <div className="w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <p className='mt-2 text-gray-600'>No receipts found. Please upload a PDF to get started.</p>
        </div>
    }
  return (
    <div>ReceiptList</div>
  )
}

export default ReceiptList