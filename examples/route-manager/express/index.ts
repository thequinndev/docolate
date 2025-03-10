import express, { NextFunction, Request, Response, Router, Application } from 'express'
import { userEndpoints } from '../endpoints'
import { EndpointArrayByOperationIds, EndpointBase, InferRequest, InferResponses } from '@thequinndev/route-manager/endpoint'

// This is just an example of how you can quickly type-safe the express router
const expressRouter = <
    Operations extends EndpointArrayByOperationIds<EndpointBase[]>
>(router: Router, operations: Operations) => {
    const operation = <
    OperationId extends keyof Operations,
    Operation extends Operations[OperationId],
    Req extends Omit<Request, 'path' | 'params' | 'body'> & InferRequest<Operation>,
    ZodResponses extends InferResponses<Operation>,
    Res extends Omit<Response, 'json' | 'status'> & {
        json: (response: ZodResponses['defaultSuccess']) => Response,
        status: <Code extends keyof Omit<ZodResponses, 'defaultSuccess'>>(code: Code) => {
            json: (response: ZodResponses[Code]) => Response
        }
    }
    >(operationId: OperationId, fn: (req: Req, res: Res, next?: NextFunction) => void) => {
        const operationItem = operations[operationId]
        router[operationItem.method](operationItem.path, fn as unknown as Application)

        return {
            operation
        }
    }

    return {
        operation
    }
}

const router = express.Router()

const userRouter = expressRouter(router, userEndpoints)

userRouter.operation('getUserById', (req, res) => {
    try {
        if (!req.path.userId) {
            return res.status(400).json([{
                code: 'BAD_REQUEST',
                message: 'Invalid request.'
            }])
        }
    
        const userNotFound = Math.random() === 1
    
        if (userNotFound) {
            return res.status(404).json([{
                code: 'RESOURCE_NOT_FOUND',
                message: 'User not found'
            }])
        }
    
        return res.status(200).json(
            {   
                id: 1,
                description: 'Test',
                name: 'Test'
            }
        )
    } catch (error) {
        return res.status(500).json('Internal Server Error')
    }
})

userRouter.operation('createUser', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json([{
                code: 'BAD_REQUEST',
                message: 'Invalid request.'
            }])
        }
    
        return res.status(200).json(
            {   
                id: 1,
                description: 'Test',
                name: 'Test'
            }
        )
    } catch (error) {
        return res.status(500).json('Internal Server Error')
    }
})