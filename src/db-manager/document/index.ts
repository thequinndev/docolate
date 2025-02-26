import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  BaseQueryItem,
  GetQuery,
  QueriesByAlias,
  QueryIn,
  QueryOut,
} from "../query.types";

export enum ParameterStrategy {
  Plain = 0,
  QuestionMark = 1,
  Ampersand = 2,
  Colon = 3,
  Dollar = 4,
}

type QueryAnnotation<T extends BaseQueryItem> = {
    title?: string,
    parameterExample?: QueryIn<T['parameters']>,
    returnExample?: QueryOut<T>
}

export const DocumentManager = <
  Queries extends QueriesByAlias<BaseQueryItem[]>,
>(config: {
  paramaterStrategy: ParameterStrategy;
  queries: Queries;
}) => {
  let aliasMetadata: Record<string, QueryAnnotation<BaseQueryItem>> = {};

  const annotate = <
    Alias extends keyof Queries,
    QueryItem extends GetQuery<Queries, Alias>,
  >(alias: Alias, annotation: QueryAnnotation<QueryItem>) => {
    aliasMetadata[alias as string] = annotation
  }

  const collectParameters = (queryString: string): string[] => {
    if (config.paramaterStrategy === ParameterStrategy.Dollar) {
        return queryString.match(/\$[0-9]+/g) ?? []
    }

    return []
  }

  const processProperties = (schema: z.ZodAny): string[] => {
    const props: string[] = []
    const jsonSchema = zodToJsonSchema(schema) as any
    const dataType = jsonSchema.type ?? null
    if (dataType) {
        props.push(`\n\t* type: ${dataType}`)
    }
    const min = jsonSchema.minLength ?? jsonSchema.minimum ?? null
    if (min) {
        props.push(`\n\t* min: ${min}`)
    }
    const max = jsonSchema.maxLength ?? jsonSchema.maximum ?? null
    if (max) {
        props.push(`\n\t* max: ${max}`)
    }

    return props
  }

  const compileDataTypes = (item: BaseQueryItem) => {
    const params = collectParameters(item.query)

    const dataTypeSections: string[] = []
    let index = 0
    for (const param of item.parameters?.original ?? []) {
        const firstKey = Object.keys(param)[0]
        const schema = param[firstKey] as z.ZodAny
        const props = processProperties(schema)
        
        const paramSection = params[index] ? `${params[index]} => ` : ''
        dataTypeSections.push(`* ${paramSection}${firstKey}${props.join('\n')}`)
        index++
    }

    if (!dataTypeSections.length) {
        return null
    }

    return dataTypeSections.join('\n')
  }

  const compile = () => {
    const aliasSections: string[] = []
    for (const queryAlias in config.queries) {
        const aliasSection: string[] = []
        const query = config.queries[queryAlias]
        const meta = aliasMetadata[queryAlias] ?? null
        const title = meta?.title ? `${meta?.title} ` : ''
        aliasSection.push(`## ${title}[alias: ${query.alias}]`)
        if (query.description) {
            aliasSection.push(`> ${query.description}`)
        }

        aliasSection.push(`### Query`)
        const dataTypes = compileDataTypes(query)
        if (dataTypes) {
            aliasSection.push(dataTypes)
        }

        aliasSection.push(`\`\`\`\n${query.query}\n\`\`\``)

        if (meta?.parameterExample) {
            aliasSection.push(`### Invoke Example`)
            aliasSection.push(`\`\`\`\nqueryManager.run('${query.alias}', ${JSON.stringify(meta.parameterExample, null, 2)})\n\`\`\``)
        }

        if (meta?.returnExample) {
            aliasSection.push(`### Return Example`)
            aliasSection.push(`\`\`\`\n${JSON.stringify(meta.returnExample, null, 2)}\n\`\`\``)
        }
        
        aliasSections.push(aliasSection.join('\n'))
    }

    return aliasSections.join('\n')
  };

  return {
    annotate,
    compile,
  };
};
