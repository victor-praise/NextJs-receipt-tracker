'use client'
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
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
    <div>Receipt</div>
  )
}

export default Receipt