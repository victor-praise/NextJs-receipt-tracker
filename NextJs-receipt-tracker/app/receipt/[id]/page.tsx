'use client'
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Receipt() {
    const params = useParams<{id:string}>();
  const router = useRouter();
    const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);

const receipt = useQuery( api.receipts.getReceiptById, receiptId ? { id: receiptId } : "skip" );

  const fileId = receipt?.fileId;

  const downloadUrl = useQuery(api.receipts.getReceiptsDownloadUrl, fileId ? {fileId}: "skip");

    useEffect(()=>{
      try {
        const id = params.id as Id<"receipts">;
        setReceiptId(id);
      } catch (error) {
        console.error("Invalid receipt ID: ", error);
        router.push("/");
      }
    },[params.id, router])

    if(receipt===undefined){
      return (<div className='container mx-auto py-10 px-4'>
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
         
        </div>
      </div>)
    }
    if(receipt===null){
      return (<div className='container mx-auto py-10 px-4'>
        <div className='max-w-2l mx-auto text-center'>
          <h1 className='text-2xl font-bold mb-4'>Receipt not found</h1>
          <p className='text-gray-600'>The receipt you are looking for does not exist.</p>
          <Link href={"/"} className='text-blue-500 hover:underline mt-4 inline-block'>Go back to home</Link>
        </div>
      </div>)
    }

  const uploadDate = receipt ? new Date(receipt.uploadedAt).toLocaleDateString() : '';

  const hasExtractedData = !!(receipt && (receipt.merchantName || receipt.merchantAddress || receipt.transactionDate || receipt.transactionAmount));
    
  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        <nav className="mb-6">
          <Link href={"/receipts"} className='text-blue-500 hover:underline flex items-center'>
            <ChevronLeft className='h-4 w-4 mr-1' />
          Back to Receipts</Link>
        </nav>

        <div className='bg-white shadow-md rounded-lg overflow-hidden mb-6'>
          <div className="p-6">
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-2xl font-bold text-gray-900 truncate'>{receipt?.fileDisplayName || receipt?.fileName}</h1>
              <div className="flex items-center">
                {receipt.status === "pending" ? (
                  <div className='mr-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2  border-yellow-800'></div>
                  </div>
                ) : null}
                <span className={`px-3 py-1 rounded-full text-sm ${receipt.status==="pending" ? "bg-yellow-100 text-yellow-800" : receipt.status==="processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receipt