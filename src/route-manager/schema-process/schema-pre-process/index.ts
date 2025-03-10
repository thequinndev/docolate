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

export const schemaPreProcess = (schema: any) => {
    if (schema.anyOf) {
        schema = removeUselessAnyOf(schema)
    }

    return schema
}