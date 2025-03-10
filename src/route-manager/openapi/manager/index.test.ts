import { ApiDocumentExample, UserDocumentExample, MissingDocsExample } from "../../../../examples/route-manager/openapi/manager"

describe("OpenAPIManager", () => {
    it('Will build ApiDocumentExample', () => {
        expect(ApiDocumentExample.build({ failOnError: false })).toEqual({
            "errors": [],
            "spec": {
                "components": {
                    "schemas": {
                        "ApiDocumentation": {
                            "properties": {
                                "apiDocumentation": {
                                    "format": "uri",
                                    "type": "string",
                                },
                                "apiStatus": {
                                    "enum": [
                                        "active",
                                        "deprecated",
                                        "inactive",
                                    ],
                                    "type": "string",
                                },
                                "apiVersion": {
                                    "type": "string",
                                },
                            },
                            "required": [
                                "apiVersion",
                                "apiStatus",
                                "apiDocumentation",
                            ],
                            "type": "object",
                        },
                    },
                },
                "paths": {
                    "/": {
                        "description": "API Root",
                        "get": {
                            "description": "The API Documentation",
                            "operationId": "getApiDocumentation",
                            "responses": {
                                "200": {
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "$ref": "#/components/schemas/ApiDocumentation",
                                            },
                                        },
                                    },
                                    "description": "Current API metadata for this version",
                                },
                                "400": {
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "items": {
                                                    "additionalProperties": false,
                                                    "description": "Error",
                                                    "properties": {
                                                        "code": {
                                                            "type": "string",
                                                        },
                                                        "message": {
                                                            "type": "string",
                                                        },
                                                    },
                                                    "required": [
                                                        "code",
                                                        "message",
                                                    ],
                                                    "type": "object",
                                                },
                                                "type": "array",
                                            },
                                        },
                                    },
                                    "description": "Bad request",
                                },
                                "404": {
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "items": {
                                                    "additionalProperties": false,
                                                    "description": "Error",
                                                    "properties": {
                                                        "code": {
                                                            "type": "string",
                                                        },
                                                        "message": {
                                                            "type": "string",
                                                        },
                                                    },
                                                    "required": [
                                                        "code",
                                                        "message",
                                                    ],
                                                    "type": "object",
                                                },
                                                "type": "array",
                                            },
                                        },
                                    },
                                    "description": "Resource not found",
                                },
                                "500": {
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "enum": [
                                                    "Internal Server Error",
                                                ],
                                                "type": "string",
                                            },
                                        },
                                    },
                                    "description": "Internal server error",
                                },
                            },
                        },
                        "summary": "Base Endpoint"
                    },
                },
            },
        })
    })


    it('Will build UserDocumentExample', () => {
        const document = UserDocumentExample.build({ failOnError: false })
        expect(document.errors).toEqual([])
        expect(document.spec.components).toEqual({
            "schemas": {
                "User": {
                    "properties": {
                        "description": {
                            "type": "string",
                        },
                        "id": {
                            "type": "number",
                        },
                        "name": {
                            "type": "string",
                        },
                    },
                    "required": [
                        "id",
                        "name",
                        "description",
                    ],
                    "type": "object",
                },
            },
        })

        expect(document.spec.paths["/users"]).toEqual({
            "description": "All User Operations",
            "get": {
                "description": "Search for users by their name or description",
                "operationId": "searchUsers",
                "parameters": [
                    {
                        "in": "query",
                        "name": "name",
                        "required": false,
                        "schema": {
                            "anyOf": [
                                {
                                    "not": {},
                                },
                                {
                                    "type": "string",
                                },
                            ],
                        },
                    },
                    {
                        "in": "query",
                        "name": "description",
                        "required": false,
                        "schema": {
                            "anyOf": [
                                {
                                    "not": {},
                                },
                                {
                                    "type": "string",
                                },
                            ],
                        },
                    },
                ],
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "User",
                                        "properties": {
                                            "description": {
                                                "type": "string",
                                            },
                                            "id": {
                                                "type": "number",
                                            },
                                            "name": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "id",
                                            "name",
                                            "description",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Successfully retrieved a list of users",
                    },
                    "400": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Bad request",
                    },
                    "404": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Resource not found",
                    },
                    "500": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "enum": [
                                        "Internal Server Error",
                                    ],
                                    "type": "string",
                                },
                            },
                        },
                        "description": "Internal server error",
                    },
                },
            },
            "post": {
                "description": "Create a new user",
                "operationId": "createUser",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "example": {
                                "description": "A new user",
                                "name": "John Smith",
                            },
                            "schema": {
                                "$ref": "#/components/schemas/User",
                            },
                        },
                    },
                },
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "example": {
                                    "description": "A new user",
                                    "id": 1,
                                    "name": "John Smith",
                                },
                                "schema": {
                                    "$ref": "#/components/schemas/User",
                                },
                            },
                        },
                        "description": "Successfully created the user",
                    },
                    "400": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Bad request",
                    },
                    "404": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Resource not found",
                    },
                    "500": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "enum": [
                                        "Internal Server Error",
                                    ],
                                    "type": "string",
                                },
                            },
                        },
                        "description": "Internal server error",
                    },
                },
            },
            "summary": "All User Endpoints",
        })
        
        expect(document.spec.paths["/users/{userId}"]).toEqual({
            "description": "Specific User Operations",
            "get": {
                "description": "Get a user by their User ID",
                "operationId": "getUserById",
                "parameters": [
                    {
                        "in": "path",
                        "name": "userId",
                        "required": true,
                        "schema": {
                            "type": "number",
                        },
                    },
                ],
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User",
                                },
                            },
                        },
                        "description": "Successfully retrieved the user",
                    },
                    "400": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Bad request",
                    },
                    "404": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Resource not found",
                    },
                    "500": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "enum": [
                                        "Internal Server Error",
                                    ],
                                    "type": "string",
                                },
                            },
                        },
                        "description": "Internal server error",
                    },
                },
            },
            "put": {
                "description": "Update a user by their User ID",
                "operationId": "updateUser",
                "parameters": [
                    {
                        "in": "path",
                        "name": "userId",
                        "required": true,
                        "schema": {
                            "type": "number",
                        },
                    },
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/User",
                            },
                        },
                    },
                },
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User",
                                },
                            },
                        },
                        "description": "Successfully updated the user",
                    },
                    "400": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Bad request",
                    },
                    "404": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": false,
                                        "description": "Error",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                            },
                                            "message": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "code",
                                            "message",
                                        ],
                                        "type": "object",
                                    },
                                    "type": "array",
                                },
                            },
                        },
                        "description": "Resource not found",
                    },
                    "500": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "enum": [
                                        "Internal Server Error",
                                    ],
                                    "type": "string",
                                },
                            },
                        },
                        "description": "Internal server error",
                    },
                },
            },
            "summary": "User By ID Endpoints",
        })

    })

    it('Will return errors for MissingDocsExample in failOnError: false', () => {
        const result = MissingDocsExample.build({ failOnError: false })
        expect(result.errors).toEqual([{
            "message": "Description is missing for response status 200",
            "method": "get",
            "operationId": "getApiDocumentation",
            "path": "/",
            "severity": "error",
        },
        {
            "message": "Description is missing for response status 400",
            "method": "get",
            "operationId": "getApiDocumentation",
            "path": "/",
            "severity": "error",
        },
        {
            "message": "Description is missing for response status 404",
            "method": "get",
            "operationId": "getApiDocumentation",
            "path": "/",
            "severity": "error",
        },
        {
            "message": "Description is missing for response status 500",
            "method": "get",
            "operationId": "getApiDocumentation",
            "path": "/",
            "severity": "error",
        },])
    })

    it('Will throw an error for MissingDocsExample when failOnError: true', () => {
        try {
            MissingDocsExample.build({ failOnError: true })
        } catch (error) {
            expect(error).toEqual(new Error(JSON.stringify({
                "message": "Description is missing for response status 200",
                "operationId": "getApiDocumentation",
                "path": "/",
                "method": "get",
                "severity": "error"
            }, null, 2)))
        }
    })

});
