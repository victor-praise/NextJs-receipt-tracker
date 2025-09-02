'use client'
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Doc } from '@/convex/_generated/dataModel';
import { ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ReceiptList() {
    
const router = useRouter();
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
    <div className="w-full">
        <h2 className='text-xl font-semibold mb-4'>Your Receipts</h2>
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                </TableHeader>

                <TableBody>
                    {receipts && receipts.map((receipt: Doc<"receipts">)=>(
                        <TableRow key={receipt._id} className='cursor-pointer hover:bg-gray-50'
                        
                        onClick={()=>{
                           router.push( `/receipt/${receipt._id}`);
                        }}>
                            <TableCell className='py-2'>
                                <FileText className="h-6 w-6 text-red-500"/>
                            </TableCell>
                            <TableCell className="font-medium">{receipt.fileDisplayName || receipt.fileName}</TableCell>
                            <TableCell>{(receipt.size / 1024).toFixed(2)} KB</TableCell>
                            <TableCell>{new Date(receipt.uploadedAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {receipt.transactionAmount ? `${receipt.transactionAmount} ${receipt.currency || ""}` : "-"}</TableCell>
                            <TableCell><span className={`px-2 text-xs py-2 rounded-full ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-800" : receipt.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                                </span></TableCell>
                            <TableCell className='text-right'>
                                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto"/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}

export default ReceiptList