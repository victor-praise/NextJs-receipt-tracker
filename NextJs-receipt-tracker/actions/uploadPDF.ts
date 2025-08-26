'use server';

import {currentUser} from "@clerk/nextjs/server";

export async function uploadPdf(formData: FormData) {
    const user = await currentUser();

    if(!user){
        return {success:false, message:"User not authenticated"};
    }
    try {
        
    } catch (error) {
        console.error("Error uploading PDF:", error);
        return {success:false, message:"Error uploading PDF"};
    }
}