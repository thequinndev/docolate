# Docolate
Sweet documentation.
## DB Manager
The first module in Docolate (more planned). It is currently a work in progress. Requires zod: https://zod.dev/

### Module Intent
<details>
  <summary>Click to expand</summary>

The intent of this module is to support the maintenance and usage of queries used throughout a Typescript application. It attempts to "solve" a handful of problems that I personally wanted to solve for my own projects.
* Documenting queries
  * If there were any bespoke queries in my application I wanted to make sure I had oversight over them. A - So I wasn't creating duplicates & B - So I could review the queries easily.
  * Auto generation of documentation for my suite of queries so I don't have to write as much of it myself.
* Properly inferring the input and output data types for all queries (using zod) - even bespoke ones.
  * If I store zod schemas to use for my database queries I can tie them into other downstream things like APIs
* Simplified query calling
  * When I call a query I want to know exactly what I need to provide, what its data type is, and what I will get back.
    
Taking this postgres (pg) client function call as an example.
```typescript
const result = await client.query('select from update_user($1, $2, $3)', [1234, 'Interesting new value', ''])
```
In calling these queries throughout my application, I found myself forgetting:
  * What the parameters to my function were (and their data types) - All I was seeing was $1 $2 $3
  * What data type is my function returning (is it string, boolean, json...)?
  * Have I already implemented this?

</details>

### Query Manager
The query manager can be used to store queries relating to specific database entities. The queries can be in any format you like. See the ``examples/db-manager`` folder for a full working example.

#### Step 1 - Define your queries
* Query: - string - 'select * from create_user($1, $2)' - The query you want to run
* Alias: - string - 'createUser' - The alias for this query
* Description - string - The description for this query - Used for documentation
* Parameters - Record<string, ZodAny>[] - The parameters in order of use. The array format helps maintain this order.
  * If a parameter is used twice declare it twice and it will be merged down into a single item (see Note on duplicate parameters below). 
* Returns - ZodAny - The expected output data type schema.
```typescript
import { z } from "zod";
import { query, queryGroup, queryParameters } from '@thequinndev/db-manager'

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
})

const createUser = query({
    query: 'select * from create_user($1, $2)',
    alias: 'createUser',
    description: 'Create a user',
    parameters: queryParameters([
        {
            name: userTableSchema.shape.name
        },
        {
            description: userTableSchema.shape.description
        }
    ] as const),
    returns: userTableSchema
})

const userQueries = queryGroup([
    createUser
])
```
### Note on duplicate parameters
Hyphothetically if you need to use the same parameter twice in a query. For example here (bad example for demonstration only) where $1 and $2 will be the same user_id.
```sql
select * from my_table
where user_id = $1
AND user_id NOT IN (
  select user_id from my_table where user_id <> $2
)
```
In this instance you would declare the property twice and it will be merged down into one key in the function call. You need to declare all the values so every item in the array can be parameterized properly.
```typescript
const createUser = query({
    query: `select * from my_table
    where user_id = $1
    AND user_id NOT IN (
      select user_id from my_table where user_id <> $2
    )`,
    alias: 'queryThatWillNeverHappen',
    description: 'Just an example for merging keys',
    parameters: queryParameters([
        {
            userId: z.number()
        },
        {
            userId: z.number()
        }
    ] as const),
    returns: z.unknown()
})

queryManager.run('queryThatWillNeverHappen', {userId: 1234})
```
