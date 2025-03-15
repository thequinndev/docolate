import { SchemaData } from '../../data';
import { MermaidErDiagramObjectMeta } from '../../er-diagram.meta'
import { renderErDiagramObject } from "../render-object";

export const renderErDiagramSchema = (schemaData: SchemaData['schemas'][string]) => {
    const mermaidBodyData: MermaidErDiagramObjectMeta = {}
    for (const entityData of Object.values(schemaData.entities)) {
        const schemaName = `${schemaData.schemaName}.${entityData.name}`
        mermaidBodyData[schemaName] = {
            mermaidBody: renderErDiagramObject(entityData)
        }
    }
    return mermaidBodyData
}