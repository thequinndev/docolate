import { OASVersions } from "../../openapi"
import { schema30 } from "../schema30"

const removeUselessAnyOf = (schema: any) => {
    if (Array.isArray(schema.anyOf)) {
        schema.anyOf = schema.anyOf.filter((item: any) => {
            if (item.not) {
                return false
            }
            return true
        })

        if (schema.anyOf.length === 1) {
            schema = schema.anyOf[0]
        }
    }
    
    return schema
}

export const schemaPreProcess = (schema: any, version: OASVersions) => {
    if (schema.anyOf) {
        schema = removeUselessAnyOf(schema)
    }

    if (version === '3.0') {
        schema = schema30(schema)
    }

    return schema
}