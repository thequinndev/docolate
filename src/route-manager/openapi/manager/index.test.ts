import { ApiDocumentExample, UserDocumentExample, MissingDocsExample } from "../../../../examples/route-manager/openapi/manager"

describe("OpenAPIManager", () => {
  it('Will build ApiDocumentExample', () => {
    expect(ApiDocumentExample.build({failOnError: false})).toEqual({
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
              "description": "The API Documentation",
              "get": {
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
            },
          },
        },
      })
  })


  it('Will build UserDocumentExample', () => {
    expect(UserDocumentExample.build({failOnError: false})).toEqual({
        "errors": [],
        "spec": {
          "components": {
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
          },
          "paths": {
            "/users": {
              "description": "Search for users by their name or description",
              "get": {
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
            },
            "/users/{userId}": {
              "description": "Get a user by their User ID",
              "get": {
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
            },
          },
        },
      })
  })

  it('Will return errors for MissingDocsExample in failOnError: false', () => {
    const result = MissingDocsExample.build({failOnError: false})
    expect(result.errors).toEqual([])
  })

});
