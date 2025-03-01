#!/usr/bin/env node

"use strict";

const docolate = require("../dist/index.cjs");
const fs = require("fs");
const yaml = require("yaml");

function parseArgs(args) {
  const result = {};

  // Loop through the arguments
  args.forEach((arg) => {
    const match = arg.match(/^--(.+?)=(.+)$/); // Match --arg=value format
    if (match) {
      result[match[1]] = match[2];
    }
  });

  return result;
}

function buildChangeSet(configFile, action, args, dir) {
  const config = docolate.MigrationManager.parseMigrationManagerConfig(configFile)
  
  if (action === 'build') {
      if (args['prefix']) {
          const target = config.migrationGroups.find(item => item.prefix === args['prefix'])
          if (!target) {
              throw new Error(`Prefix ${args['prefix']} does not exist.`)
          }

          // Determine if it's a ts or yml
          // Need to determine if .ts parsing in this context is even possible.
          // The success has been flaky. It works locally, but not in docker.
          // It may fix itself when the package becomes installable from npm later
          const configFileTs = `${dir}/${config.configDir}/${target.prefix}_migrate.ts`
          if (fs.existsSync(configFileTs)) {
              const changeSetConfig = require(configFileTs).changeSet
              const parsed = docolate.MigrationManager.parseChangesetConfigConfig(changeSetConfig)
              docolate.MigrationManager.buildChangeSet(config, parsed, args['prefix'], curDir);
          }

          //yml case
          const configFileYml = `${dir}/${config.configDir}/${target.prefix}_migrate.yml`
          if (fs.existsSync(configFileYml)) {
              const changeSetConfig = yaml.parse(fs.readFileSync(configFileYml).toString())
              const parsed = docolate.MigrationManager.changesetConfigSchema.parse(changeSetConfig)
              docolate.MigrationManager.buildChangeSet(config, parsed, args['prefix'], curDir);
          }
          //yaml case
          const configFileYaml = `${dir}/${config.configDir}/${target.prefix}_migrate.yaml`
          if (fs.existsSync(configFileYaml)) {
              const changeSetConfig = yaml.parse(fs.readFileSync(configFileYaml).toString())
              const parsed = docolate.MigrationManager.changesetConfigSchema.parse(changeSetConfig)
              docolate.MigrationManager.buildChangeSet(config, parsed, args['prefix'], curDir);
          }
          //json case - probably won't happen as it'a difficult to write free-form commands
          //js case - will require making some jsdoc to help with types (or another method)
          //other consideration is do I just allow yaml only for simplicity...

      }
  }
}

const curDir = process.cwd();
const ymlExists = fs.existsSync(`${curDir}/docolate-migrate.yml`);
const yamlExists = fs.existsSync(`${curDir}/docolate-migrate.yaml`);
if (!ymlExists && !yamlExists) {
  throw new Error("docolate-migrate config file has not been created.");
}

const ymlFile = ymlExists
  ? fs.readFileSync(`${curDir}/docolate-migrate.yml`)
  : fs.readFileSync(`${curDir}/docolate-migrate.yaml`);

try {
  const action = process.argv[2] ?? null;
  const args = parseArgs(process.argv.slice(3));
  const parsedYml = yaml.parse(ymlFile.toString());
  buildChangeSet(parsedYml, action, args, curDir);
} catch (error) {
  console.error(error)
}