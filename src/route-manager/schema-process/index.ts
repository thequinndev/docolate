import { z } from "zod";
import { OASVersions, ValidRefFormat } from "../openapi/openapi.types";
import { RouteManagerErrors } from "../errors";
import { schemaIs } from "../utility";
import { convertAndStrip } from "./convert-and-strip";

const refFormats = {
    schemas: '#/components/schemas' as ValidRefFormat,
    parameters: '#/components/parameters' as ValidRefFormat
}

export const SchemaProcessor = (version: OASVersions) => {
    const componentsObject = {
        schemas: {},
        parameters: {}
    } as {
        schemas?: any,
        parameters?: any
    }

    const makeSchemaRef = (ref: string) => `${refFormats.schemas}/${ref}`
    const makeParameterRef = (ref: string) => `${refFormats.parameters}/${ref}`

    const getSchemaId = (schema: z.ZodType<any>): string | null => {
        return schema._def.description ?? null;
    };

    const processObject = (schema: z.ZodObject<any>): any => {
        const jsonSchema = convertAndStrip(schema, version) as any;
        return jsonSchema
    };

    const processProperty = (schema: z.ZodSchema): any => {
        const jsonSchema = convertAndStrip(schema, version);
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

            if (schemaIs.array(valueSchema)) {
                collected.properties[key] = {
                    ...handleArray(valueSchema)
                }
            } else if (schemaIs.object(valueSchema)) {
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

    const handleArray = (schema: z.ZodArray<any>): any => {
        // Array components add a complexity overhead and prevent the underlying objects from being modular
        // I also don't think they're even allowed under components.schemas in OpenAPI
        if (getSchemaId(schema)) {
            throw new Error(RouteManagerErrors.NoArrayRefs)
        }

        const arrayJsonSchema = convertAndStrip(schema, version)

        const internalSchema = (schema as z.ZodArray<any>).element
        if (schemaIs.object(internalSchema)) {
            const ref = getSchemaId(internalSchema)
            if (ref) {
                const result = processZodObject(
                    internalSchema as z.ZodObject<any>
                );

                componentsObject.schemas[ref] = result

                arrayJsonSchema.items = {
                    '$ref': makeSchemaRef(ref)
                }

                return arrayJsonSchema
            }

        }

        arrayJsonSchema.items = convertAndStrip(internalSchema, version)
        return arrayJsonSchema
    }

    const processSchema = (schema: z.ZodType<any>): any => {

        if (schemaIs.array(schema)) {

            // Array components add a complexity overhead and prevent the underlying objects from being modular
            if (getSchemaId(schema)) {
                throw new Error(RouteManagerErrors.NoArrayRefs)
            }

            return handleArray(schema as z.ZodArray<any>)
        }

        if (schemaIs.object(schema)) {
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

        return convertAndStrip(schema, version);
    }

    const getComponents = () => {
        if (Object.keys(componentsObject.schemas).length == 0) {
            delete componentsObject.schemas
        }
        if (Object.keys(componentsObject.parameters).length == 0) {
            delete componentsObject.parameters
        }

        return {
            components: {
                ...componentsObject
            }
        }
    }

    const ensureParametersTypesAreThereAndAdd = (ref: string, schema: any) => {
        componentsObject.parameters[ref] = schema
    }

    const processParameter = (parameterBase: any, schema: z.ZodType<any>) => {
        const ref = getSchemaId(schema)
        if (ref) {
            const paramRef = makeParameterRef(ref)
            ensureParametersTypesAreThereAndAdd(ref, {
                ...parameterBase,
                schema: convertAndStrip(schema, version)
            })
            return {
                '$ref': paramRef
            }
        }

        return {
            ...parameterBase,
            schema: convertAndStrip(schema, version)
        }
    }

    return {
        getSchemaId,
        processSchema,
        getComponents,
        processParameter
    }
}


