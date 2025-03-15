import zodToJsonSchema from 'zod-to-json-schema';
import { schemaPreProcess } from '.'
import { z } from 'zod';

describe("schemaPreProcess", () => {
    describe("with Primitives - 3.0", () => {
      it("Will account for nullish string", () => {
        const schema = zodToJsonSchema(z.string().nullish())
        const result = schemaPreProcess(schema, '3.0')
        expect(result).toEqual({
            type: 'string',
            nullable: true
        })
      })

      it("Will account for nullish number", () => {
        const schema = zodToJsonSchema(z.number().nullish())
        const result = schemaPreProcess(schema, '3.0')
        expect(result).toEqual({
            type: 'number',
            nullable: true
        })
      })

      it("Will account for union", () => {
        const schema = zodToJsonSchema(z.string().or(z.number()))
        const result = schemaPreProcess(schema, '3.0')
        expect(result.type).toEqual({
            oneOf: [{
                type: 'string',
            },{
                type: 'number',
            }
        ]
        })
      })

    });
});