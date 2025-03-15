import { MermaidERConfig } from "./config";
import { renderErDiagramSchema } from './render/render-schema';

export const renderERDiagram = (config: MermaidERConfig) => {

    let mermaidData = {
        mermaidObjects: {},
    }

    for (const schemaData of Object.values(config.data.schemas)) {
        mermaidData = {
            ...mermaidData,
            ...{
                mermaidObjects: renderErDiagramSchema(schemaData),
            }
            
        }
    }

    return mermaidData
}