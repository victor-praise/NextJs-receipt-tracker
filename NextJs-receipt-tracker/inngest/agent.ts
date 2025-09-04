import { createAgent, anthropic, createNetwork,getDefaultRoutingAgent, } from '@inngest/agent-kit';
import { createServer } from '@inngest/agent-kit/server';

import { inngest } from './client';
import Events from './agents/constants';
import { databaseAgent } from './agents/databaseAgents';


const agentNetwork = createNetwork({
    name:"Agent Team",
    agents:[databaseAgent,receiptScanningAgent],
    defaultModel:anthropic({model:"clause-3-5-sonnet-latest",
        defaultParameters:{max_tokens:1000,},
    }),
    defaultRouter:({network})=>{
        const savedToDatabase = network.state.kv.get("saved-to-database");
        if(savedToDatabase !== undefined){
            return undefined;
        }
        return getDefaultRoutingAgent();
    }
})

export const server = createServer({
    agents:[databaseAgent,receiptScanningAgent],
    network:[agentNetwork],
})

export const extractAndSavePDF = inngest.createFunction(
    {id:"Extract and Save PDF Data"},
    {event:Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE},
    async({event})=>{
     
        const result = await agentNetwork.run(
            `Extract the key data from this pdf: ${event.data.url}. Once the data is extracted, save it to the database using receiptId: ${event.data.receiptId}. Once the receipt is successfully saved to the database you can terminate the agent process.`)
       
            return result.state.kv.get("receipt");
      
    }
)