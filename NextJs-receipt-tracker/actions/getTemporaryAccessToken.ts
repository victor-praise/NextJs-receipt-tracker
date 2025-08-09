'use server'

import {currentUser} from '@clerk/nextjs/server';
// Import SchematicClient from its package or module
import { SchematicClient } from '@schematichq/schematic-typescript-node';


const client =  new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_KEY,})
