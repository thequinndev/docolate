import { z } from 'zod'
import { ComponentFactory } from '.'
import { RouteManagerErrors } from '../errors'

describe("ComponentFactory", () => {

    describe("makeSchema", () => {
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
    
    
        it('Will throw an error on arrays', () => {
            try {
                componentFactory.makeSchema(
                    z.object({
                        id: z.number(),
                        name: z.string()
                    }).array(),
                    'Error'
                )
            } catch(error) {
                expect(error).toEqual(new Error(RouteManagerErrors.NoArrayRefs))
            }

        })
    })
})