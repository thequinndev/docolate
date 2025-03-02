import { z } from "zod";

const preConfigSchema = z.object({
    up: z.string().array().optional(),
    down: z.string().array().optional()
})
const postConfigSchema = z.object({
    up: z.string().array().optional(),
    down: z.string().array().optional()
})

const cmdOrFileXor = z.object({
    pre: z.string().array().optional(),
    post: z.string().array().optional(),
    file: z.object({
        fileName: z.string(),
        ref: z.string().nullable().optional(),
    }).optional(),
    cmd: z.string().array().optional(),
})

export type CmdOrFile = z.input<typeof cmdOrFileXor>

const changeItemConfigSchema = z.object({
    description: z.string().optional(),
    up: cmdOrFileXor,
    down: cmdOrFileXor,
})

export type ChangeItemConfig = z.input<typeof changeItemConfigSchema>

export const changesetConfigSchema = z.object({
    description: z.string().optional(),
    upRef: z.string().nullable(),
    downRef: z.string().optional(),
    pre: preConfigSchema.optional(),
    changeItemGroups: z.object({
        groupName: z.string(),
        description: z.string().optional(),
        pre: preConfigSchema.optional(),
        changeItems: changeItemConfigSchema.array(),
        post: postConfigSchema.optional(),
    }).array(),
    post: postConfigSchema.optional(),
})

export type ChangesetConfig = z.input<typeof changesetConfigSchema>

export const migrationManagerConfigSchema = z.object({
    prefixStrategy: z.enum(['date', 'timestamp', 'numeric']).default('timestamp'),
    outputDir: z.string().default('migrations'),
    migrationGroupsDir: z.string().default('docolate-migrate'),
    splitBy: z.object({
        none: z.object({
            upFileFormat: z.string().default('{{prefix}}.up.sql'),
            downFileFormat: z.string().default('{{prefix}}.down.sql'),
        }).optional(),
        group: z.object({
            upFileFormat: z.string().optional().default('{{prefix}}_{{increment}}_{{groupName}}.up.sql'),
            downFileFormat: z.string().optional().default('{{prefix}}_{{increment}}_{{groupName}}.down.sql'),
        }).optional()
    }).optional()
    .default({
        none: {
            upFileFormat: '{{prefix}}.up.sql',
            downFileFormat: '{{prefix}}.down.sql'
        }
    }),
    migrationGroups: z.object({
        prefix: z.string()
    }).array().default([])
})

export type MigrationManagerConfig = z.infer<typeof migrationManagerConfigSchema>

export const parseMigrationManagerConfig = (config: any) => {
    return migrationManagerConfigSchema.parse(config)
}

export const parseChangesetConfigConfig = (config: any) => {
    return changesetConfigSchema.parse(config)
}