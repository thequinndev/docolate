export const schema30 = (schema: any) => {
    
    if (Array.isArray(schema.type)) {
        // First determine if it contains null, in OAS3.0, you cannot have null as a type it must be nullable: true
        if (schema.type.includes('null')) {
            schema.type = schema.type.filter(item => item !== 'null')
            schema.nullable = true
        }

        if (schema.type.length > 1) {
            schema.type = {
                oneOf: schema.type.map(item => {
                    return {type: item}
                })
            }
        }

        if (schema.type.length === 1) {
            schema.type = schema.type[0]
        }
    }

    return schema
}