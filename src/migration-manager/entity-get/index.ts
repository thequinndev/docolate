import { readFileSync } from "fs";
import { runCmdAndGetString } from "../exec";
import { CmdOrFile} from "../migration-manager.config";
import { MigrationConstants } from "../constants";

export const entityGet = (input: CmdOrFile, ref?: string | null) => {
    
    // If there was a ref override for the file then use it
    if (input?.file?.ref !== undefined) {
        ref = input.file.ref
    }

    const buildEntityFileGetCmd = (ref: string, file: string) => {
        return `git show ${ref}:${file};`
    }

    const gatherPost = (input: CmdOrFile, entityList: string[]): string[] => {
        if (input.post) {
            for (const cmd of input.post) {
                entityList.push(cmd)
            }
        }

        return entityList
    }

    let entityList: string[] = []

    if (input.pre) {
        for (const cmd of input.pre) {
            entityList.push(cmd)
        }
    }

    if (input.cmd) {
        for (const cmd of input.cmd) {
            entityList.push(cmd)
        }
        entityList = gatherPost(input, entityList)
        return entityList.join(MigrationConstants.Padding)
    }

    if (ref === null) {
        entityList.push(readFileSync(input.file!.fileName).toString().trim())
        entityList.push()
        entityList = gatherPost(input, entityList)
        return entityList.join(MigrationConstants.Padding)
    }

    entityList.push(runCmdAndGetString(buildEntityFileGetCmd(ref!, input.file!.fileName)))
    entityList = gatherPost(input, entityList)
    return entityList.join(MigrationConstants.Padding)
}