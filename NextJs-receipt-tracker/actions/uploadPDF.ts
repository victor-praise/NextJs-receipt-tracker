'use server';

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import {currentUser} from "@clerk/nextjs/server";

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
    } catch (error) {
        console.error("Error uploading PDF:", error);
        return {success:false, message:"Error uploading PDF"};
    }
}