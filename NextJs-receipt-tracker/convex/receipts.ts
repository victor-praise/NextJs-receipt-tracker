import {v} from "convex/values";
import {query, mutation} from "./_generated/server";

export const generateUploadUrl = mutation({ 
    args:{},
    handler:async(ctx)=>{

        return await ctx.storage.generateUploadUrl();
    },

});

export const storeReceipt = mutation({
    args:{
        userId:v.string(),
        fileId:v.id("_storage"),
        fileName:v.string(),
        size:v.number(),
        mimeType:v.string(),
    },
    handler:async(ctx,args)=>{

       const receiptId = await ctx.db.insert("receipts",{
        userId:args.userId,
        fileName:args.fileName,
        fileId:args.fileId,
        uploadedAt:Date.now(),
        size:args.size,
        mimeType:args.mimeType,
        status:"pending",

        merchantName:undefined,
        merchantAddress:undefined,
        merchantContact:undefined,
        transationDate:undefined,
        transactionAmount:undefined,
        currency:undefined,
        items:[],
           

       });
       return receiptId;
    },
});

