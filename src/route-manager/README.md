# Route Manager

## Usage Recommendations
### Favour a single value enum over a string literal
Instead of
```
const error500 = z.literal('Internal Server Error')
```
Use
```
const error500 = z.enum(['Internal Server Error'])
```
#### Why?
A single value enum is functionally identical to a string literal. An enum will also map more nicely to an API spec and code generation. It also allows you more extensibility for multiple string literals and removes the need to document an example.