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

    describe("makeParameterItem", () => {
        const componentFactory = ComponentFactory({
            schemas: [],
            parameters: [
                'QueryMock',
                'PathMock'
            ]
        })
        it('Will make parameters', () => {
            const queryMock = componentFactory.makeParameterItem(
                z.string().optional(),
                'QueryMock'
            )
    
            expect(queryMock.description).toEqual('QueryMock')
            expect(queryMock.parse('string')).toEqual('string')

            const pathMock = componentFactory.makeParameterItem(
                z.string(),
                'PathMock'
            )
    
            expect(pathMock.description).toEqual('PathMock')
            expect(pathMock.parse('string')).toEqual('string')
        })
    
    
        it('Will throw an error on arrays', () => {
            try {
                componentFactory.makeParameterItem(
                    z.string().array(),
                    'PathMock'
                )
            } catch(error) {
                expect(error).toEqual(new Error(RouteManagerErrors.NoArrayParameter))
            }

        })

        it('Will throw an error on objects', () => {
            try {
                componentFactory.makeParameterItem(
                    z.object({}),
                    'PathMock'
                )
            } catch(error) {
                expect(error).toEqual(new Error(RouteManagerErrors.NoObjectParameter))
            }

        })
    })
})