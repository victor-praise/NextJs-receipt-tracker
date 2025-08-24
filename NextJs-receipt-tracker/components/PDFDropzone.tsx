'use client'

import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,

} from "@dnd-kit/core";

function PDFDropzone() {
    const sensors = useSensors(
        useSensor(PointerSensor),
    );
  return (
    <DndContext
        sensors={sensors}>
        <div className="w-full max-w-md mx-auto ">
        <div onDragOver={canUpload? handleDragOver:undefined}
            onDragLeave={canUpload? handleDragLeave:undefined}
            onDrop={canUpload? handleDrop:(e)=>e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 '} ${!canUpload ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
        </div>    
        </div>
        
        </DndContext>
  )
}

export default PDFDropzone