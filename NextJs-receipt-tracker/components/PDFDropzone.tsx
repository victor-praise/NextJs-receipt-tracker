'use client'

import { uploadPdf } from "@/actions/uploadPDF";
import { useUser } from "@clerk/clerk-react";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,

} from "@dnd-kit/core";
import { Button } from '@/components/ui/button'
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { AlertCircle, CheckCircle, Cloud, CloudUpload } from "lucide-react";

import { useRouter } from "next/navigation";
import React from "react";
import { useCallback } from "react";

function PDFDropzone() {
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [upLoadedFiles, setUploadedFiles] = React.useState<string[]>([]);
    const user = useUser();
    const router = useRouter();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const {value:isFeatureEnabled,
        featureUsageExceeded,
        featureAllocation,
    } = useSchematicEntitlement("scans");
    const sensors = useSensors(
        useSensor(PointerSensor),
    );

   
     const handleUpload = useCallback(async (files: FileList | File[]) => {
        if(!user){
            alert("Please sign in to upload files.");
            return;
        }

        const fileArray = Array.from(files);
        const pdfFiles = fileArray.filter(file => file.type === "application/pdf" || file.name.endsWith(".pdf"));
        if (pdfFiles.length === 0) {
            alert("Please upload PDF files only.");
            return;
        }
        setIsUploading(true);
        try {
            const newUploadedFiles: string[] = [];
            
            
            for(const file of pdfFiles){
                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadPdf(formData);

                if(!result.success){
                   throw new Error(result.message || "Upload failed");
                }
              newUploadedFiles.push(file.name);
            }
            setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
            alert("Files uploaded successfully");

            setTimeout(() => {
                setUploadedFiles([]);
            }, 5000);

            router.push("/receipts");
        }
        catch (error) {
            console.error("Error uploading files:", error);
            alert("Error uploading files. Please try again.");} finally {
                setIsUploading(false);
            }
        
     },[user,router]);


     
    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOver(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOver(false);
    }, []);
   
    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOver(false);

        if(!user){
            alert("Please sign in to upload files.");
            return;
        }
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            // Handle the dropped files here
            console.log("Dropped files:", files);
            handleUpload(event.dataTransfer.files);
        }
    }, [user, handleUpload]);

    const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files?.length){
            handleUpload(event.target.files);
        }
    }, [handleUpload]);
   const triggerFileInput = useCallback(() => {fileInputRef.current?.click();},[])
   const isUserSignedIn = !!user;
    const canUpload = isUserSignedIn && isFeatureEnabled;
  return (
    <DndContext
        sensors={sensors}>
        <div className="w-full max-w-md mx-auto ">
        <div onDragOver={canUpload? handleDragOver:undefined}
            onDragLeave={canUpload? handleDragLeave:undefined}
            onDrop={canUpload? handleDrop:(e)=>e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 '} ${!canUpload ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                {isUploading ? (<div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2 "></div>
                    <p>Uploading...</p>
                </div>): !isUserSignedIn ? (<><CloudUpload className="mx-auto h-12 w-12 text-gray-400"/>
                        <p className="mt-2 text-gray-600">Please sign in to upload PDFs.</p></>) : (<>
                        <Cloud className="mx-auto h-12 w-12 text-gray-400"/>
                        <p className="mt-2 text-sm text-gray-600">Drag and Drop files here, or click to select files</p>
                        <input type="file" multiple accept="application/pdf,.pdf" ref={fileInputRef} className="hidden"
                            onChange={handleFileInputChange}
                            
                            />
                            <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFeatureEnabled}
                            onClick={triggerFileInput}>
                                {isFeatureEnabled ? "Select Files" : "Upgrade to Upload"}
                            </Button>
                </>)}
        </div>    
        <div className="mt-4">
            {featureUsageExceeded && ( <div className="flex items-center p-3 bg-res-50 border border-red-200 rounded-md text-red-600">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
                <span>You have exceeded your upload limit of {featureAllocation} PDFs. Please upgrade your plan.</span>
            </div>)}
        </div>

        {upLoadedFiles.length > 0 && (
            <div className="mt-4">
                <h3 className="font-medium">Uploaded Files:</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {upLoadedFiles.map((fileName, index) => (
                        <li key={index} className="text-green-500">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                            {fileName}</li>
                    ))}
                </ul>
            </div>
        )}

        </div>
        
        </DndContext>
  )
}

export default PDFDropzone