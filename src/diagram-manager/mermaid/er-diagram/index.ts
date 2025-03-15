import { MermaidERConfig } from "./config";
import { RelationshipType } from "./data";
import { renderErDiagramSchema } from './render/render-schema';

const LeftHand: Record<RelationshipType, string> = {
    ZeroOrOne: "|o",
    ExactlyOne: "||",
    ZeroOrMore: "}o",
    OneOrMore: "}|",
}
  
const RightHand: Record<RelationshipType, string> = {
    ZeroOrOne: "o|",
    ExactlyOne: "||",
    ZeroOrMore: "o{",
    OneOrMore: "|{",
}

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