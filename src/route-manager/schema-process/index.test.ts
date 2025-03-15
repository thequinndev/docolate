import { z } from "zod";
import { SchemaProcessor } from ".";
import { RouteManagerErrors } from "../errors";

describe("getSchemaId", () => {
  describe("with ID", () => {
    it("will return an ID if it exists (object)", () => {
      const schemaProcessor = SchemaProcessor('3.0');
      const testSchema = z.object({}).describe("Mock");
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual("Mock");
    });

    it("will return an ID if it exists (property)", () => {
      const schemaProcessor = SchemaProcessor('3.0');
      const testSchema = z.string().describe("Mock");
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual("Mock");
    });
  });

  describe("without ID", () => {
    it("will return null if it does not exist (object)", () => {
      const schemaProcessor = SchemaProcessor('3.0');
      const testSchema = z.object({});
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual(null);
    });

    it("will return null if it does not exist (property)", () => {
      const testSchema = z.string();
      const schemaProcessor = SchemaProcessor('3.0');
      const id = schemaProcessor.getSchemaId(testSchema);
      expect(id).toEqual(null);
    });
  });
});

describe("processSchema", () => {
  describe("with Object", () => {
    it("Will return a compiled json schema including refs", () => {
      const schemaProcessor = SchemaProcessor('3.0');
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
              required: ["key1"],
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
              required: ["key2"],
            },
            Layer3: {
              type: "object",
              properties: {
                key3: {
                  type: "string",
                },
              },
              required: ["key3"],
            },
          },
        },
      });
      expect(result).toEqual({
        $ref: "#/components/schemas/Layer1",
      });
    });
    it("Will return a compiled json schema including refs", () => {
        const schemaProcessor = SchemaProcessor('3.0');

        const layer2 = z
          .object({
            key2: z.string(),
          })
          
  
        const layer1 = z
          .object({
            key1: layer2,
          })
          
  
        const result = schemaProcessor.processSchema(layer1);
        expect(result).toEqual({
            "properties": {
              "key1": {
                "properties": {
                  "key2": {
                    "type": "string",
                  },
                },
                "required": [
                  "key2",
                ],
                "type": "object",
              },
            },
            "required": [
              "key1",
            ],
            "type": "object",
          });
    });
    it("Will return a compiled json schema including refs - and handle no ref at the top level", () => {
      const schemaProcessor = SchemaProcessor('3.0');
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

      const layer1 = z.object({
        key1: layer2,
      });

      const result = schemaProcessor.processSchema(layer1);
      expect(schemaProcessor.getComponents()).toEqual({
        components: {
          schemas: {
            Layer2: {
              type: "object",
              properties: {
                key2: {
                  schema: {
                    $ref: "#/components/schemas/Layer3",
                  },
                },
              },
              required: ["key2"],
            },
            Layer3: {
              type: "object",
              properties: {
                key3: {
                  type: "string",
                },
              },
              required: ["key3"],
            },
          },
        },
      });
      expect(result).toEqual({
        type: "object",
        properties: {
          key1: {
            schema: {
              $ref: "#/components/schemas/Layer2",
            },
          },
        },
        required: ["key1"],
      });
    });
  });

  describe("with Object With Nested Arrays", () => {
    it("Will return a compiled json schema including refs", () => {
      const schemaProcessor = SchemaProcessor('3.0');
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
          key1: layer2.array(),
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
                  items: {
                    $ref: "#/components/schemas/Layer2",
                  },
                  type: "array"
                },
              },
              required: ["key1"],
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
              required: ["key2"],
            },
            Layer3: {
              type: "object",
              properties: {
                key3: {
                  type: "string",
                },
              },
              required: ["key3"],
            },
          },
        },
      });
      expect(result).toEqual({
        $ref: "#/components/schemas/Layer1",
      });
    });
    it("Will return a compiled json schema including refs", () => {
        const schemaProcessor = SchemaProcessor('3.0');

        const layer2 = z
          .object({
            key2: z.string(),
          })
          
  
        const layer1 = z
          .object({
            key1: layer2,
          })
          
  
        const result = schemaProcessor.processSchema(layer1);
        expect(result).toEqual({
            "properties": {
              "key1": {
                "properties": {
                  "key2": {
                    "type": "string",
                  },
                },
                "required": [
                  "key2",
                ],
                "type": "object",
              },
            },
            "required": [
              "key1",
            ],
            "type": "object",
          });
    });
    it("Will return a compiled json schema including refs - and handle no ref at the top level", () => {
      const schemaProcessor = SchemaProcessor('3.0');
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

      const layer1 = z.object({
        key1: layer2,
      });

      const result = schemaProcessor.processSchema(layer1);
      expect(schemaProcessor.getComponents()).toEqual({
        components: {
          schemas: {
            Layer2: {
              type: "object",
              properties: {
                key2: {
                  schema: {
                    $ref: "#/components/schemas/Layer3",
                  },
                },
              },
              required: ["key2"],
            },
            Layer3: {
              type: "object",
              properties: {
                key3: {
                  type: "string",
                },
              },
              required: ["key3"],
            },
          },
        },
      });
      expect(result).toEqual({
        type: "object",
        properties: {
          key1: {
            schema: {
              $ref: "#/components/schemas/Layer2",
            },
          },
        },
        required: ["key1"],
      });
    });
  });

  describe("with Array", () => {
    it("Will throw an error if you try to make an $ref array", () => {
        const invalidArray = z.object({name: z.string()}).array().describe('Anything')
        try {
            const schemaProcessor = SchemaProcessor('3.0')
            schemaProcessor.processSchema(invalidArray)
        } catch(error) {
            expect(error).toEqual(new Error(RouteManagerErrors.NoArrayRefs))
        }
    })


    it("Will return a primitive array as a normal schema", () => {
        const primitiveArray = z.string().array()
        const schemaProcessor = SchemaProcessor('3.0')
        expect(schemaProcessor.processSchema(primitiveArray)).toEqual({
            "items": {
                "type": "string",
              },
              "type": "array",
        })
    })
  });
});


describe("getComponents", () => {
  describe("with No previous action", () => {
    it("Will return an empty object", () => {
          const schemaProcessor = SchemaProcessor('3.0')
          expect(schemaProcessor.getComponents()).toEqual({
              components: {}
          })
    })
  });

});