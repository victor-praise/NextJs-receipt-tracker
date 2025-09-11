'use client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useSchematicFlag } from '@schematichq/schematic-react';
import { useQuery } from 'convex/react';
import { ChevronLeft, FileText, Lightbulb, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Receipt() {
    const params = useParams<{id:string}>();
  const router = useRouter();
  const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);

  const isSummariesEnabled = useSchematicFlag("summary");

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">File Information</h3>
                    <div className='mt-2 bg-gray-50 p-4 rounded-lg'>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Uploaded</p>
                          <p className="font-medium">{uploadDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Size</p>
                          <p className="font-medium">{(receipt.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{receipt.mimeType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ID</p>
                          <p className="font-medium truncate" title={receipt._id}>{receipt._id.slice(0,10)}...</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-center p-8 bg-gray-50 rounded-lg'>
                    <div className="text-center">
                      <FileText className='h-16 w-16 text-blue-500 mx-auto' />
                      <p className="mt-4 text-gray-500">PDF Preview</p>
                      {downloadUrl && (
                        <a href={downloadUrl} className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block" target="_blank" rel="noopener noreferrer">
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                { hasExtractedData && (
                  <div className='mt-8'>
                    <h3 className="text-lg font-semibold mb-4">Receipt Details</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">Merchant Information</h4>
                        <div className="space-y-2">
                          {receipt.merchantName && (
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">{receipt.merchantName}</p>
                            </div>
                          )}
                          {receipt.merchantAddress && (
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">{receipt.merchantAddress}</p>
                            </div>
                          )}
                          {receipt.merchantContact && (
                            <div>
                              <p className="text-sm text-gray-500">Contact</p>
                              <p className="font-medium">{receipt.merchantContact}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">Transaction Details</h4>
                        <div className="space-y-2">
                          {receipt.transactionDate && (
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">{new Date(receipt.transactionDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {receipt.transactionAmount && (
                            <div>
                              <p className="text-sm text-gray-500">Amount</p>
                              <p className="font-medium">{receipt.transactionAmount } {receipt.currency || ""}</p>
                            </div>
                          )}
                        
                        </div>
                      </div>
                    </div>

                    {
                      receipt.receiptSummary && (
                        <>
                        {
                          isSummariesEnabled ? (
                          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                          <div className="flex items-center mb-4">
                            <h4 className="font-medium text-blue-700">AI-Generated Summary</h4>
                          <div className="ml-2 flex">
                            <Sparkles className='h-3.5 w-3.5 text-yellow-500'/>
                            <Sparkles className='h-3 w-3 text-yellow-400 -ml-1'/>
                          </div>
                          </div>
                          <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-100">
                            <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700">{receipt.receiptSummary}</p>
                          </div>  
                          <div className="mt-3 text-xs text-blue-600 italic flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            <span>AI-generated summary based on receipt data</span>
                          </div>
                          </div>
                          
                        ):(
                            <div className = "mt-6 bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <h4 className="font-semibold text-gray-500">AI-Generated Summary</h4>
                                  <div className='ml-2 flex'>
                                    <Sparkles className='h-3.5 w-3.5 text-yellow-500'/>
                                    <Sparkles className='h-3 w-3 text-yellow-400 -ml-1'/>
                                  </div>
                                </div>
                                <Lock className='h-4 w-4 text-gray-400 mx-auto mb-3'/>
                              </div>
                              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                                <Link href="/manage-plan" className='text-center py-4'>
                                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3"/>
                                <p className="text-sm text-gray-500 mb-2">AI summary is a PRO level feature</p>
                                <button className="mt-2 px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block">Upgrade to PRO</button>
                                </Link>
                              </div>
                              <div className="mt-3 text-xs text-gray-400 italic flex items-center">
                                <Lightbulb className="h-3 w-3 mr-1" />
                                <span>AI-generated summary based on receipt data</span>
                              </div>
                            </div>
                          )
                        }
                        </>
                      )
                    }
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receipt

function formatCurrency(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency ? `${currency}` : ''}`;
}