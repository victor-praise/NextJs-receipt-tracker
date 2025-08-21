"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart, Search, Upload } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <>
     <div>
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
      <div className='mt-12 flex justify-center'>
        <div className='relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white overflow-hidden shadow-lg dark:border-gray-800 dark:bg-gray-950'>
          <div className='p-6 md:p-8 relative'>
            <p>PDF dropzone goes here....</p>
        </div> 
        </div> 
        </div> 
      </section>
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className='flex flex-col items-center space-y-6 text-center'>
             <div className='space-y-2'>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Powerful Features</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">Our AI-powered platform tansforms how you handle receipts and track epenses</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               <div className='flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800'>
                 <div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900'>
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold">Easy Uploads</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">Quickly upload receipts via drag-and-drop or file selection</p>
               </div>
               <div className='flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800'>
                 <div className='p-3 rounded-full bg-green-100 dark:bg-green-900'>
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                 </div>
                 <h3 className="text-xl font-bold">AI Analysis</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">Automatically extract and categorize expense data with intelligent AI</p>
               </div>
               <div className='flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800'>
                 <div className='p-3 rounded-full bg-green-100 dark:bg-green-900'>
                    <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400"/>
                 </div>
                 <h3 className="text-xl font-bold">Expense Insights</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">Generate reports and gain valuable insights from your spending patterns</p>
               </div>


             </div>
           </div>
        </div>
       
       
      </section>
     </div>
    </>
  );
}



