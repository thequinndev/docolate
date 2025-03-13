import {OpenAPISpecCompiler} from '.'

import { ApiDocumentExample, UserDocumentExample } from "../../../../examples/route-manager/openapi/manager"
import { metaManagerExample } from "../../../../examples/route-manager/openapi/meta-manager"

describe("OpenAPISpecCompiler", () => {
    it('Will compile all examples', () => {
        const compiler = OpenAPISpecCompiler({
            version: '3.0',
            specFile: {
                openapi: '3.0.0',
                info: {
                    title: 'Mock',
                    version: '1.0.0'
                }
            },
            metaManager: metaManagerExample,
            openApiManagers: [
                ApiDocumentExample,
                UserDocumentExample
            ]
        })

        expect(compiler.build()).toEqual( {
            "components": {
              "parameters": {
                "PathUserId": {
                  "description": "Test",
                  "example": 0,
                  "in": "path",
                  "name": "userId",
                  "required": true,
                  "schema": {
                    "type": "number",
                  },
                },
                "QueryUserName": {
                  "description": "Example",
                  "in": "query",
                  "name": "name",
                  "required": false,
                  "schema": {
                    "type": "string",
                  },
                },
              },
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
                "Error": {
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
                "UserCreate": {
                  "properties": {
                    "description": {
                      "type": "string",
                    },
                    "name": {
                      "type": "string",
                    },
                  },
                  "required": [
                    "name",
                    "description",
                  ],
                  "type": "object",
                },
                "UserGet": {
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
            },
            "info": {
              "title": "Mock",
              "version": "1.0.0",
            },
            "openapi": "3.0.0",
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
                              "$ref": "#/components/schemas/Error",
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
                              "$ref": "#/components/schemas/Error",
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
                  "tags": [
                    "docolate",
                    "example",
                    "route-manager",
                  ],
                },
                "summary": "Base Endpoint",
              },
              "/users": {
                "description": "All User Operations",
                "get": {
                  "deprecated": true,
                  "description": "Search for users by their name or description",
                  "operationId": "searchUsers",
                  "parameters": [
                    {
                      "$ref": "#/components/parameters/QueryUserName",
                    },
                    {
                      "description": "Example",
                      "in": "query",
                      "name": "description",
                      "required": false,
                      "schema": {
                        "type": "string",
                      },
                    },
                  ],
                  "responses": {
                    "200": {
                      "content": {
                        "application/json": {
                          "schema": {
                            "items": {
                              "$ref": "#/components/schemas/UserGet",
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
                              "$ref": "#/components/schemas/Error",
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
                              "$ref": "#/components/schemas/Error",
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
                          "$ref": "#/components/schemas/UserCreate",
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
                            "$ref": "#/components/schemas/UserGet",
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
                              "$ref": "#/components/schemas/Error",
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
                              "$ref": "#/components/schemas/Error",
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
              },
              "/users/{userId}": {
                "description": "Specific User Operations",
                "get": {
                  "description": "Get a user by their User ID",
                  "operationId": "getUserById",
                  "parameters": [
                    {
                      "$ref": "#/components/parameters/PathUserId",
                    },
                  ],
                  "responses": {
                    "200": {
                      "content": {
                        "application/json": {
                          "examples": {
                            "valid": {
                              "value": {
                                "description": "A new user",
                                "id": 123,
                                "name": "John Smith",
                              },
                            },
                          },
                          "schema": {
                            "$ref": "#/components/schemas/UserGet",
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
                              "$ref": "#/components/schemas/Error",
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
                              "$ref": "#/components/schemas/Error",
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
                          "$ref": "#/components/schemas/UserGet",
                        },
                      },
                    },
                  },
                  "responses": {
                    "200": {
                      "content": {
                        "application/json": {
                          "schema": {
                            "$ref": "#/components/schemas/UserGet",
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
                              "$ref": "#/components/schemas/Error",
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
                              "$ref": "#/components/schemas/Error",
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
              },
            },
            "tags": [
              {
                "name": "example",
              },
              {
                "name": "docolate",
              },
              {
                "name": "route-manager",
              },
            ],
          })
    })
})