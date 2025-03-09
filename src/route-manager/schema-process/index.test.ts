import { z } from "zod";
import { SchemaProcessor } from ".";

describe("getSchemaId", () => {
  describe("with ID", () => {
    it("will return an ID if it exists (object)", () => {
      const schemaProcessor = SchemaProcessor();
      const testSchema = z.object({}).describe("Mock");
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual("Mock");
    });

    it("will return an ID if it exists (property)", () => {
      const schemaProcessor = SchemaProcessor();
      const testSchema = z.string().describe("Mock");
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual("Mock");
    });
  });

  describe("without ID", () => {
    it("will return null if it does not exist (object)", () => {
      const schemaProcessor = SchemaProcessor();
      const testSchema = z.object({});
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual(null);
    });

    it("will return null if it does not exist (property)", () => {
      const testSchema = z.string();
      const schemaProcessor = SchemaProcessor();
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual(null);
    });
  });
});

describe("processSchema", () => {
  describe("with Object", () => {
    it("Will return a compiled json schema including refs", () => {
      const schemaProcessor = SchemaProcessor();
      const layer3 = z
        .object({
          key3: z.string(),
        })
        .describe("Layer3");

      const layer2 = z
        .object({
          key2: layer3,
        })
        .describe("Layer2");

      const layer1 = z
        .object({
          key1: layer2,
        })
        .describe("Layer1");

      const result = schemaProcessor.processSchema(layer1);
      expect(schemaProcessor.getComponents()).toEqual({
        components: {
          schemas: {
            Layer1: {
              type: "object",
              properties: {
                key1: {
                  schema: {
                    $ref: "#/components/schemas/Layer2",
                  },
                },
              },
              required: [
                'key1'
              ]
            },
            Layer2: {
              type: "object",
              properties: {
                key2: {
                  schema: {
                    $ref: "#/components/schemas/Layer3",
                  },
                },
              },
              required: [
                'key2'
              ]
            },
            Layer3: {
              type: "object",
              properties: {
                key3: {
                  type: "string",
                },
              },
              required: [
                'key3'
              ]
            },
          },
        },
      });
      expect(result).toEqual({
        $ref: "#/components/schemas/Layer1" ,
      });
    });
  });
});
