'use client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Router } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Receipt() {
    const params = useParams<{id:string}>();
  const router = useRouter();
    const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);

    const receipt = useQuery(api.receipts.getReceiptById, receiptId ? { receiptId }: "skip");

    useEffect(()=>{
      try {
        const id = params.id as Id<"receipts">;
        setReceiptId(id);
      } catch (error) {
        console.error("Invalid receipt ID: ", error);
        router.push("/");
      }
    },[params.id, router])
  return (
    <div>Receipt</div>
  )
}

export default Receipt