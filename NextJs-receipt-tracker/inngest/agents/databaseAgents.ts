import { createAgent,createTool,openai } from "@inngest/agent-kit";
import { z, ZodObject } from "zod";

// const schema: ZodObject<any> = z.object({
const saveToDatabaseTool = createTool({
    name:"save-to-database",
    description:"Saves the given data to the convex database.",
    parameters: z.object({
        fileDisplayName:z.string().describe("The readable display name of the receipt to show in the UI. if the file name is not human readable, use this to give a more readable name."),
        receiptId:z.string().describe("The id of the receipt to update in the database."),
        merchantName:z.string(),
        merchantAddress:z.string(),
        merchantContact:z.string(),
        transactionDate:z.string(),
        transactionAmount:z.string().describe("The total amount of the transaction"),
        receiptSummary:z.string().describe("A summary of the receipt, including the merchant name, address, contact, transaction date, transaction amount, and currency. Include a human readable summary of the receipt. Mention both invoice number and receipt number if both are present. Include some key details about the items on the receipt, this is a special featured summary so it should include some key details about the items on the receipt with some context."),
        currency:z.string(),
        items:z.array(
            z.object({
                name:z.string(),
                quantity:z.number(),
                price:z.string(),
                total:z.string(),
            }).describe("An array of items on the receipt. Include the name, quantity, unit price, and total price of each item."),
        )
    }) as ZodObject<any>,
    handler:async({input})=>{},
    
})

export const databaseAgent = createAgent({
    name:"Database Agent",
    description:"Agent that interact with the database to save and retrieve receipt data.",
    system:"You are a helpful assistant that takes key information regarding receipts and saves it to the convex database.",
    model:openai({model:"gpt-4o-mini", defaultParameters:{max_completion_tokens:1000}}),
    tools:[saveToDatabaseTool],
    // Define tasks and workflows here
});