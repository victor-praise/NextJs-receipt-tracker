import { createAgent, anthropic, createNetwork,getDefaultRoutingAgent } from '@inngest/agent-kit';
import { dataexports } from '@schematichq/schematic-typescript-node/api';
import { inngest } from './client';
import Events from './agents/constants';


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
        const {fileUrl,receiptId} = event.data;
       
        agentNetwork.state.kv.set("saved-to-database",true);
    }
)