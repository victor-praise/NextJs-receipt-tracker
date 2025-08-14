"use client";

import {SchematicEmbed as SchematicEmbedComponent} from "@schematichq/schematic-react";

function SchematicEmbed({accessToken,componentId}:{accessToken:string;componentId:string}) {
    return <SchematicEmbedComponent componentId={componentId} accessToken={accessToken} />
}