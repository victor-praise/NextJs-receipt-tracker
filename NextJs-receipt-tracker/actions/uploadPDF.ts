'use server';

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import {currentUser} from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import { inngest } from "@/inngest/client";

import { url } from "inspector";
import Events from "@/inngest/agents/constants";

export async function uploadPdf(formData: FormData) {
    const user = await currentUser();

    if(!user){
        return {success:false, message:"User not authenticated"};
    }
    try {
        // get the file from the form data
        const file = formData.get("file") as File;
        if(!file){
            return {success:false, message:"No file provided"};
        }
        // validate file type
        if(file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")){
            return {success:false, message:"Only PDF files are allowed"};
        }
        // get upload url from the api
        const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl,{});

        // convert file to array buffer
        const arrayBuffer = await file.arrayBuffer();

        const uploadResponse = await fetch(uploadUrl, {
            method:"POST",
            headers:{
                "Content-Type":file.type,
            },
            body: new Uint8Array(arrayBuffer),
        });

        if(!uploadResponse.ok){
            return {success:false, message:"Failed to upload file to storage"};
        }
        const {storageId} = await uploadResponse.json();

        const receiptId = await convex.mutation(api.receipts.storeReceipt,{
            userId:user.id,
            fileId:storageId,
            fileName:file.name,
            size:file.size,
            mimeType:file.type,
        });


        const fileUrl = await getFileDownloadUrl(storageId);

        await inngest.send({
            name: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
            data:{
                url:fileUrl.downloadUrl,
                receiptId
            }
        })


        return {success:true, data:{
            receiptId,
            fileName:file.name,
        }};
    } catch (error) {
        console.error("Error uploading PDF:", error);
        return {success:false, message:"Error uploading PDF"};
    }
}