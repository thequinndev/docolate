import { z } from 'zod'
import { ComponentFactory } from '.'

describe("ComponentFactory", () => {
    const componentFactory = ComponentFactory({
        schemas: [
            'User',
            'Error'
        ]
    })
    it('Will make components', () => {
        const userSchema = componentFactory.makeSchema(
            z.object({
                id: z.number(),
                name: z.string()
            }),
            'User'
        )

        expect(userSchema.description).toEqual('User')
        expect(userSchema.parse({
            id: 0,
            name: 'string'
        })).toEqual({
            id: 0,
            name: 'string'
        })
    })
})