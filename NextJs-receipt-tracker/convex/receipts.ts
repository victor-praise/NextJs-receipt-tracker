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

export const getReceipt = query({
    args:{
        userId:v.string(),
    },
    handler:async(ctx,args)=>{
        return await ctx.db.query("receipts").filter((r)=>r.eq(r.field("userId"),args.userId)).order("desc").collect();
    }
});

export const getReceiptById = query({  
    args:{
        receiptId:v.id("receipts"),
    },
    handler:async(ctx,args)=>{
        const receipts = await ctx.db.get(args.receiptId);

        if(receipts){
            const identity = await ctx.auth.getUserIdentity();
            if(!identity){
                throw new Error("Not authenticated");
            }
            const userId = identity.subject;

            if(receipts.userId !== userId){
                throw new Error("Not authorized to access this receipt");
            }
        }
    }
})

export const getReceiptsDownloadUrl = query({
    args:{fileId:v.id("_storage")},
    handler:async(ctx,args)=>{
        return await ctx.storage.getUrl(args.fileId);
    }
});

export const updateReceipt = mutation({
    args:{
        id: v.id("receipts"),
        status:v.string(),
    },
    handler:async(ctx,args)=>{
        const receipt = await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;
        if(receipt.userId !== userId){
            throw new Error("Not authorized to update this receipt");
        }
         await ctx.db.patch(args.id,{
            status:args.status,
        });
        return true;
    }
});

export const deleteReceipt = mutation({
    args:{
        id:v.id("receipts"),
    },
    handler:async(ctx,args)=>{
        const receipt = await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;
        if(receipt.userId !== userId){
            throw new Error("Not authorized to delete this receipt");
        }
         await ctx.storage.delete(receipt.fileId);

        await ctx.db.delete(args.id);
       
        return true;
    }
});

export const updateReceiptWithExtractedData = mutation({
    args:{
        id:v.id("receipts"),
        fileDisplayName:v.optional(v.string()),
        merchantName:v.optional(v.string()),
        merchantAddress:v.optional(v.string()),
        merchantContact:v.optional(v.string()),
        transationDate:v.optional(v.string()),
        transactionAmount:v.optional(v.number()),
        currency:v.optional(v.string()),
        receiptSummary:v.optional(v.string()),
        items:v.optional(v.array(v.object({
            name:v.string(),
            quantity:v.number(),
            unitPrice:v.number(),
            totalPrice:v.number(),
        }))),},
    handler:async(ctx,args)=>{
        const receipt = await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
    //    update only if the receipt belongs to the user
         await ctx.db.patch(args.id,{
            fileDisplayName:args.fileDisplayName,
            merchantName:args.merchantName,
            merchantAddress:args.merchantAddress,
            merchantContact:args.merchantContact,
            transationDate:args.transationDate,
            transactionAmount:args.transactionAmount,
            currency:args.currency,
            receiptSummary:args.receiptSummary,
            items:args.items,
            status:"processed",
        });
        return {userId:receipt.userId};
    }
})