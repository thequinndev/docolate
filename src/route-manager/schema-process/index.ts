import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { ValidRefFormat } from "../openapi/openapi.types";

const refFormats = {
    schemas: '#/components/schemas' as ValidRefFormat,
    parameters: '#/components/parameters' as ValidRefFormat
}

export const SchemaProcessor = () => {
    const componentsObject = {
        schemas: {},
        parameters: {}
    } as {
        schemas?: any,
        parameters?: any
    }

    const makeSchemaRef = (ref: string) => `${refFormats.schemas}/${ref}`

    const getSchemaId = (schema: z.ZodType<any>): string | null => {
        return schema._def.description ?? null;
      };
      
      
      const convertAndStrip = (schema: z.ZodType<any>) => {
        const jsonSchema = zodToJsonSchema(schema) as any;
        delete jsonSchema["$ref"];
        delete jsonSchema["$schema"];
        delete jsonSchema["additionalProperties"];
        delete jsonSchema["description"]
        return jsonSchema;
      };
      
      const processObject = (schema: z.ZodObject<any>): any => {
        const jsonSchema = convertAndStrip(schema) as any;
        return jsonSchema
      };
      
      const processProperty = (schema: z.ZodSchema): any => {
          const jsonSchema = convertAndStrip(schema);
        return jsonSchema 
      };
      
      const processZodObject = (
        schema: z.ZodObject<any>
      ) => {
        let collected = {} as any
      
        const shape = schema.shape

        collected = processObject(schema)
      
        for (const key in shape) {
          const valueSchema = shape[key];
      
          if (valueSchema instanceof z.ZodObject) {
            const ref = getSchemaId(valueSchema)
            const jsonSchema = processZodObject(valueSchema)
            if (ref) {
                componentsObject.schemas[ref] = {
                    ...jsonSchema
                }
                collected.properties[key] = {
                    schema: {
                      '$ref': makeSchemaRef(ref)
                    }
                }
                continue
            }

            collected.properties[key] = {
                ...jsonSchema
            }
          } else {
            collected.properties[key] = {
              ...processProperty(valueSchema)
            }
          }
        }
      
        return collected
    }

    const processSchema = (schema: z.ZodType<any>): any => {
        if (schema instanceof z.ZodObject) {
        const ref = getSchemaId(schema)
          const result = processZodObject(
            schema as z.ZodObject<any>
          );

          if (ref) {
            componentsObject.schemas[ref] = result
            return {
                '$ref': makeSchemaRef(ref) 
            }
          }
          return result;
        }
      
        return convertAndStrip(schema);
    }

    const getComponents = () => {
        if (Object.keys(componentsObject.schemas ?? {}).length == 0) {
            delete componentsObject.schemas
        }
        if (Object.keys(componentsObject.parameters ?? {}).length == 0) {
            delete componentsObject.parameters
        }

        return {
            components: {
                ...componentsObject
            }
        }
    }

    return {
        getSchemaId,
        processSchema,
        getComponents
    }
}


