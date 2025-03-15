import { ParameterStrategy, QueryManager } from '.'
import { mockArrayClient, mockKeyValueClient } from '../testing'
import { query, queryGroup, queryParameter } from '../query'
import { z } from 'zod'

describe('QueryManager', () => {
    describe('array style client', () => {
        const clientDefinitions = {
            createMock: [
                {
                    markedBy: ['mock', 2, 'mock', 'mock'],
                    returns: {
                        mock: {
                            response: 'mock'
                        }
                    }
                }
            ]
        }
        it('should resolve the parameters correctly', async () => {
            const queryManager = QueryManager({
                paramaterStrategy: ParameterStrategy.Dollar,
                client: mockArrayClient(clientDefinitions),
                queries: queryGroup([
                    query({
                        query: 'select * from create_mock($1, $2, $3, $4)',
                        alias: 'createMock',
                        description: 'Create a user',
                        parameters: [
                            queryParameter('param1', z.string()),
                            queryParameter('param2', z.number()),
                            queryParameter('param3', z.string()),
                            queryParameter('param4', z.string()),
                        ],
                        returns: z.object({
                            mock: z.object({
                                response: z.string()
                            })
                        })
                    })
                ])
            })

            const result = await queryManager.run('createMock', {
                param1: 'mock',
                param2: 2,
                param3: 'mock',
                param4: 'mock',
            })

            expect(result).toEqual({
                mock: {
                    response: 'mock'
                }
            })
        })

        it('should merge duplicates and resolve the parameters correctly', async () => {
            const queryManager = QueryManager({
                paramaterStrategy: ParameterStrategy.Dollar,
                client: mockArrayClient(clientDefinitions),
                queries: queryGroup([
                    query({
                        query: 'select * from create_mock($1, $2, $3, $4)',
                        alias: 'createMock',
                        description: 'Create a user',
                        parameters: [
                            queryParameter('param1', z.string()),
                            queryParameter('param2', z.number()),
                            queryParameter('param3', z.string()),
                            queryParameter('param1', z.string()),//duplicate of param1
                        ],
                        returns: z.object({
                            mock: z.object({
                                response: z.string()
                            })
                        })
                    })
                ])
            })

            const result = await queryManager.run('createMock', {
                param1: 'mock', // param1 only needs to be called once
                param2: 2,
                param3: 'mock',
            })

            expect(result).toEqual({
                mock: {
                    response: 'mock'
                }
            })
        })
    })

    describe('key value style client', () => {
        const clientDefinitions = {
            createMock: [
                {
                    markedBy: {
                        param1: 'mock',
                        param2: 2,
                        param3: 'mock',
                        param4: 'mock',
                    },
                    returns: {
                        mock: {
                            response: 'mock'
                        }
                    }
                }
            ]
        }
        it('should resolve the parameters correctly', async () => {
            const queryManager = QueryManager({
                paramaterStrategy: ParameterStrategy.Dollar,
                client: mockKeyValueClient(clientDefinitions),
                queries: queryGroup([
                    query({
                        query: 'select * from create_mock($1, $2, $3, $4)',
                        alias: 'createMock',
                        description: 'Create a user',
                        parameters: [
                            queryParameter('param1', z.string()),
                            queryParameter('param2', z.number()),
                            queryParameter('param3', z.string()),
                            queryParameter('param4', z.string()),
                        ],
                        returns: z.object({
                            mock: z.object({
                                response: z.string()
                            })
                        })
                    })
                ])
            })

            const result = await queryManager.run('createMock', {
                param1: 'mock',
                param2: 2,
                param3: 'mock',
                param4: 'mock',
            })

            expect(result).toEqual({
                mock: {
                    response: 'mock'
                }
            })
        })
    })
})