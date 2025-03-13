import { z } from "zod";

export const schemaIs = {
    array: (schema: z.ZodType<any>) => {
        return (schema as any)?._def?.typeName === 'ZodArray'
    },
    object: (schema: z.ZodType<any>) => {
        return (schema as any)?._def?.typeName === 'ZodObject'
    } 
}