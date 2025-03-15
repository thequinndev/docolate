import { z } from 'zod'
import { apiBuilder } from '.'
import { EndpointBase } from '../endpoint'

describe("apiBuilder", () => {
    describe('error cases', () => {
        it('Will have errors if the endpoint path is missing parameters', () => {
            const endpoint = {
                method: 'get',
                operationId: 'testOperation',
                path: '/my-path/{param1}',
                accepts: {
                    path: z.object({
                        param1: z.string(),
                        param2: z.string() // This is missing from the path
                    })
                },
                returns: {}
            } as EndpointBase
    
            const builder = apiBuilder({ version: '3.0', failOnError: false, defaultMetadata: {}})
            builder.buildParams(endpoint, 'path', [])

            expect(builder.getErrors()).toEqual([
                {
                    "message": "Path /my-path/{param1} is missing parameter param2.",
                    "method": "get",
                    "operationId": "testOperation",
                    "path": "/my-path/{param1}",
                    "severity": "error",
                  },
            ])
        })

        it('Will throw an if the endpoint path is missing parameters - failOnError = true', () => {
            const endpoint = {
                method: 'get',
                operationId: 'testOperation',
                path: '/my-path/{param1}',
                accepts: {
                    path: z.object({
                        param1: z.string(),
                        param2: z.string() // This is missing from the path
                    })
                },
                returns: {}
            } as EndpointBase
    


            try {
                const builder = apiBuilder({ version: '3.0', failOnError: true, defaultMetadata: {}})
                builder.buildParams(endpoint, 'path', [])
            } catch (error) {
                expect(error).toEqual(new Error(JSON.stringify(
                    {
                        "message": "Path /my-path/{param1} is missing parameter param2.",
                        "operationId": "testOperation",
                        "path": "/my-path/{param1}",
                        "method": "get",
                        "severity": "error",
                    }, null, 2)
                ))
            }

        })

        it('Will have errors if the parameters are not all declarted', () => {
            const endpoint = {
                method: 'get',
                operationId: 'testOperation',
                path: '/my-path/{param1}/{param2}',// param2 is missing from the accepts.path
                accepts: {
                    path: z.object({
                        param1: z.string(),
                    })
                },
                returns: {}
            } as EndpointBase
    
            const builder = apiBuilder({ version: '3.0', failOnError: false, defaultMetadata: {}})
            builder.buildParams(endpoint, 'path', [])

            expect(builder.getErrors()).toEqual([
                {
                    "message": "Path parameter param2 is not declared, but exists in path /my-path/{param1}/{param2}.",
                    "method": "get",
                    "operationId": "testOperation",
                    "path": "/my-path/{param1}/{param2}",
                    "severity": "error",
                  },
            ])
        })

        it('Will throw an if the endpoint path is missing parameters - failOnError = true', () => {
            const endpoint = {
                method: 'get',
                operationId: 'testOperation',
                path: '/my-path/{param1}/{param2}',// param2 is missing from the accepts.path
                accepts: {
                    path: z.object({
                        param1: z.string(),
                    })
                },
                returns: {}
            } as EndpointBase
    


            try {
                const builder = apiBuilder({ version: '3.0', failOnError: true, defaultMetadata: {}})
                builder.buildParams(endpoint, 'path', [])
            } catch (error) {
                expect(error).toEqual(new Error(JSON.stringify(
                    {
                        "message": "Path parameter param2 is not declared, but exists in path /my-path/{param1}/{param2}.",
                        "operationId": "testOperation",
                        "path": "/my-path/{param1}/{param2}",
                        "method": "get",
                        "severity": "error",
                    }, null, 2)
                ))
            }

        })

    })
})