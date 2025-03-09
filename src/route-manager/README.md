# Route Manager

## Usage Requirements
### Don't use .describe(...) unless it's for the purpose of identification
This rule is very important. Don't describe your schema inside the schema. The intent of this module is to abstract documentation from implementation.
Descriptions can be included during the documentation phase. Any calls to ``.describe()`` are assumed to be for schema IDs. All values set using this function are stripped from the schema after being consumed.

This module needs to leverage the describe function unless something like this can be implemented: https://github.com/colinhacks/zod/issues/4024. However, even if it does get implemented it's still a good idea to keep documentation separate from implementation.

## Usage Recommendations
### Favour a single value enum over a string literal
Instead of
```typescript
const error500 = z.literal('Internal Server Error')
```
Use
```typescript
const error500 = z.enum(['Internal Server Error'])
```
#### Why?
A single value enum is functionally identical to a string literal. An enum will also map more nicely to an API spec and code generation. It also allows you more extensibility for multiple string literals and removes the need to document an example.

