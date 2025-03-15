import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { schemaPreProcess } from "../schema-pre-process";
import { OASVersions } from "../../openapi";
import { schema30 } from "../schema30";

export const convertAndStrip = (schema: z.ZodType<any>, version: OASVersions) => {
    let jsonSchema = zodToJsonSchema(schema) as any;
    jsonSchema = schemaPreProcess(jsonSchema, version)
    delete jsonSchema["$ref"];
    delete jsonSchema["$schema"];
    delete jsonSchema["additionalProperties"];
    delete jsonSchema["description"]

    return jsonSchema;
};