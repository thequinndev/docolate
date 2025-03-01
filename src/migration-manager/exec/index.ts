import { execSync } from "child_process";

export const runCmdAndGetString = (cmd: string): string => {
    return execSync(cmd).toString().trim()
}
