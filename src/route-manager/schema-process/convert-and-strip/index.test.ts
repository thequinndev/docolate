import { z } from "zod";
import { convertAndStrip } from "./index"

describe("convertAndStrip", () => {
  describe("with Primitives", () => {
    it("Will remove useless json schema", () => {
      const result = convertAndStrip(z.string().describe('RemoveMe'), '3.0')
      expect(result).toEqual({
        type: 'string'
      })
    })
  });

  describe("with Primitives derived from objects", () => {
    it("Will remove useless json schema", () => {
      const parent = z.object({
        name: z.string()
      })
      const result = convertAndStrip(parent.shape.name.describe('RemoveMe'), '3.0')
      expect(result).toEqual({
        type: 'string'
      })
    })
  });

  describe("with Primitives derived from partial objects", () => {
    it("Will remove useless json schema", () => {
      const parent = z.object({
        name: z.string()
      }).partial()
      const result = convertAndStrip(parent.shape.name.describe('RemoveMe'), '3.0')
      expect(result).toEqual({
        type: 'string'
      })
    })
  });
});