"use server";

import {api} from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";


export async function getFileDownloadUrl(fileId:Id<"_storage"> | string){
    try {
        const downloadUrl = await convex.query(api.receipts.getReceiptsDownloadUrl,{fileId:fileId as Id<"_storage">});
        if(!downloadUrl){
            throw new Error("No download URL returned");
        }

        return {
            success:true,
            downloadUrl,
        };
    } catch (error) {
        console.error("Error getting file download URL:", error);
        throw error;
    }
}