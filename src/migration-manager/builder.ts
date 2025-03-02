import { existsSync, mkdirSync, writeFileSync } from "fs";
import {
  ChangesetConfig,
  MigrationManagerConfig,
} from "./migration-manager.config";
import { entityGet } from "./entity-get";
import { MigrationConstants } from "./constants";

type OutputConfig = {
  pre: string[];
  post: string[];
  groups: {
    header: string;
    footer: string;
    description?: string;
    pre?: string;
    post?: string;
    groupName: string;
    changes: string[];
  }[];
};

const normal = <T>(array: T[]): T[] => {
  return array;
};

const reverse = <T>(array: T[]): T[] => {
  return array.reverse();
};

/**
 *
 * @param config The changeset config
 * @param direction - The direction to move up | down
 * @returns
 */
const buildForAny = (
  config: ChangesetConfig,
  direction: "up" | "down"
): OutputConfig => {
  /**
   * The normal function will just return the array as it is
   * The reverse function will reverse it
   */
  const orderFn = direction === "up" ? normal : reverse;

  const preItems = orderFn(config.pre?.[direction] ?? []);
  const postItems = orderFn(config.post?.[direction] ?? []);

  const outputItems: OutputConfig["groups"] = [];

  const ref: string | null | undefined =
    direction === "up" ? config.upRef : (config.downRef ?? undefined);

  for (const group of orderFn(config.changeItemGroups)) {
    const output: OutputConfig["groups"][number] = {
      header: `-- BEGIN CHANGESET GROUP [${group.groupName}] --`,
      footer: `-- END CHANGESET GROUP [${group.groupName}] --`,
      groupName: group.groupName,
      changes: [],
      pre: preItems.join(MigrationConstants.Padding),
      post: postItems.join(MigrationConstants.Padding),
    };

    if (group.description) {
      output.description = `/**${MigrationConstants.Padding}Description: ${group.description}${MigrationConstants.Padding}*/`;
    }

    for (const entity of orderFn(group.changeItems)) {
      const fileBody = entityGet(entity[direction], ref);
      output.changes.push(fileBody);
    }

    outputItems.push(output);
  }

  return {
    pre: preItems,
    post: postItems,
    groups: outputItems,
  };
};

const buildForUp = (config: ChangesetConfig): OutputConfig => {
  return buildForAny(config, "up");
};

const buildForDown = (config: ChangesetConfig): OutputConfig => {
  return buildForAny(config, "down");
};

const combineGroup = (
  group: OutputConfig["groups"][number],
  includeGlobalPre: boolean,
  includeGlobalPost: boolean
): string => {
  let combined: string[] = [];
  combined.push(group.header);
  if (group.description) {
    combined.push(group.description);
  }
  if (includeGlobalPre) {
    combined = combined.concat(group.pre ?? []);
  }

  combined = combined.concat(group.changes);

  if (includeGlobalPost) {
    combined = combined.concat(group.post ?? []);
  }
  combined.push(group.footer);

  return combined.join(MigrationConstants.Padding);
};

const makeChangesetFiles = (
  migrationConfig: MigrationManagerConfig,
  outputConfig: OutputConfig,
  prefix: string,
  direction: "up" | "down"
): Record<string, string> => {
  const outputFiles: Record<string, string> = {};

  if (migrationConfig.splitBy?.none) {
    const fileName =
      direction === "up"
        ? migrationConfig.splitBy.none.upFileFormat.replace(
            "{{prefix}}",
            prefix
          )
        : migrationConfig.splitBy.none.downFileFormat.replace(
            "{{prefix}}",
            prefix
          );

    let finalOutput: string[] = [];
    finalOutput = finalOutput.concat(outputConfig.pre);

    for (const group of outputConfig.groups) {
      finalOutput.push(combineGroup(group, true, true));
    }

    finalOutput = finalOutput.concat(outputConfig.post);

    outputFiles[fileName] = finalOutput.join(MigrationConstants.Padding);
    return outputFiles;
  }

  if (migrationConfig.splitBy?.group) {
    // Otherwise it will be by group
    let increment = 0;
    const totalStart = outputConfig.groups.length - 1

    for (const group of outputConfig.groups) {
      const fileName =
        direction === "up"
          ? migrationConfig.splitBy?.group
              ?.upFileFormat!.replace("{{prefix}}", prefix)
              .replace("{{increment}}", increment.toString())
              .replace("{{groupName}}", group.groupName)
          : migrationConfig.splitBy?.group
              ?.downFileFormat!.replace("{{prefix}}", prefix)
              .replace("{{increment}}", (totalStart - increment).toString())
              .replace("{{groupName}}", group.groupName);

      let finalOutput: string[] = [];
      finalOutput = finalOutput.concat(outputConfig.pre);
      finalOutput.push(combineGroup(group, true, true));
      finalOutput = finalOutput.concat(outputConfig.post);
      outputFiles[fileName] = finalOutput.join(MigrationConstants.Padding);
      increment++
    }

    return outputFiles;
  }

  return {};
};

export const buildChangeSet = (
  migrationConfig: MigrationManagerConfig,
  changeSetConfig: ChangesetConfig,
  prefix: string,
  dir: string
) => {
  const upOutput = buildForUp(changeSetConfig);
  const downOutput = buildForDown(changeSetConfig);

  const upFiles = makeChangesetFiles(migrationConfig, upOutput, prefix, "up");
  const downFiles = makeChangesetFiles(
    migrationConfig,
    downOutput,
    prefix,
    "down"
  );

  const outDir = `${dir}/${migrationConfig.outputDir}`;
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }

  for (const fileName in upFiles) {
    const file = upFiles[fileName];
    writeFileSync(`${outDir}/${fileName}`, file);
  }

  for (const fileName in downFiles) {
    const file = downFiles[fileName];
    writeFileSync(`${outDir}/${fileName}`, file);
  }
};