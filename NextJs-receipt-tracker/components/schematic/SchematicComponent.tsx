 import { getTemporaryAccessToken } from '@/actions/getTemporaryAccessToken';
import React from 'react'
 
 async function SchematicComponent({componentId}: {componentId: string}   ) {

    if(!componentId) {
        return null;
    }
    const accessToken = await getTemporaryAccessToken();
    if(!accessToken) {
       throw new Error("Failed to get access token");
    }
   return (
     <div>SchematicComponent</div>
   )
 }
 
 export default SchematicComponent