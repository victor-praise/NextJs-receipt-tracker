'use client'

import { uploadPdf } from "@/actions/uploadPDF";
import { useUser } from "@clerk/clerk-react";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,

} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";

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
        featureUsage,
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

   
    const canUpload = true;
    // const canUpload = isUserSignedIn && isFeatureEnabled;
  return (
    <DndContext
        sensors={sensors}>
        <div className="w-full max-w-md mx-auto ">
        <div onDragOver={canUpload? handleDragOver:undefined}
            onDragLeave={canUpload? handleDragLeave:undefined}
            onDrop={canUpload? handleDrop:(e)=>e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 '} ${!canUpload ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
        </div>    
        </div>
        
        </DndContext>
  )
}

export default PDFDropzone