"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <>
     <div>
      <section>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Intelligent Receipt Scanning</h1>
            <p className="mx-auto max-w-[700] text-gray-500 md:text-xl dark:text-gray-400">Scan, analyze, and organize your receipts with AI-powered precision. Save time and gain insights from your expenses</p>
          </div>
          <div className="space-x-4">
            <Link href="/receipts">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            <Link href="#features">
            <Button variant="outline">Learn More!!!!!</Button></Link>
          </div>
        </div>
      </div>
      </section>
     </div>
    </>
  );
}



