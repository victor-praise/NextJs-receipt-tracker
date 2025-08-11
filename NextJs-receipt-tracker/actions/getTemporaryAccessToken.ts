'use server'

import {currentUser} from '@clerk/nextjs/server';
// Import SchematicClient from its package or module
import { SchematicClient } from '@schematichq/schematic-typescript-node';


const client =  new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_KEY,})

  export async function getTemporaryAccessToken() {
    const user = await currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Assuming you have a method to get the user ID
    const userId = user.id;
    const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: { id:user.id},
  } as any);
    return resp.data?.token;
  }