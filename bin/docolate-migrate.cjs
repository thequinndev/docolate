#!/usr/bin/env node

"use strict";

const docolate = require("../dist/index.cjs");
const fs = require("fs");
const yaml = require("yaml");

const Actions = {
  newUser: "new",
  build: "build",
  add: "add"
};

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

function makeDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function makeNumeric(lastValue) {
  if (lastValue === null) {
    return '0000000001'
  }
  const newNumber = parseInt(lastValue) + 1
  return newNumber.toString().padStart(10, '0')
}

function buildChangeSet(action, args, dir) {
  const ymlExists = fs.existsSync(`${dir}/docolate-migrate.yml`);
  const yamlExists = fs.existsSync(`${dir}/docolate-migrate.yaml`);

  if (action === Actions.newUser) {
    if (ymlExists || yamlExists) {
      throw new Error("docolate-migrate config yaml already exists.");
    }
    const freshStart = {
      prefixStrategy: args["prefixStrategy"] ?? undefined,
    };
    const config =
      docolate.MigrationManager.parseMigrationManagerConfig(freshStart);
    fs.writeFileSync(`${dir}/docolate-migrate.yml`, yaml.stringify(config));
    return;
  }

  if (!ymlExists && !yamlExists) {
    throw new Error("docolate-migrate config file has not been created.");
  }

  const ymlFileToUse = ymlExists ?`${dir}/docolate-migrate.yml` : `${dir}/docolate-migrate.yaml`

  const ymlFile = fs.readFileSync(ymlFileToUse)

  const configFile = yaml.parse(ymlFile.toString());
  const config =
    docolate.MigrationManager.parseMigrationManagerConfig(configFile);

  if (action === Actions.add) {
    const makeFile = (base) => `${base}_migrate.yml`

    let fileName = ''
    const newGroupConfig = docolate.MigrationManager.parseChangesetConfigConfig({
      description: 'description',
      upRef: 'ref | null',
      downRef: 'ref | undefined (remove this key entirely for undefined)',
      changeItemGroups: [{
          groupName: 'my_migration_action',
          description: 'description',
          changeItems: [],
      }],
    })

    if (!['timestamp', 'date', 'numeric'].includes(config.prefixStrategy)) {
      throw new Error('Your docolate-migrate config file contains an invalid prefixStrategy.')
    }

    if (config.prefixStrategy === 'timestamp') {
      const latestTimestamp = Math.floor(Date.now() / 1000)
      config.migrationGroups.push({prefix: latestTimestamp.toString()})
      fileName = makeFile(latestTimestamp)
    }

    if (config.prefixStrategy === 'date') {
      const latestDate = makeDate()
      // Date is potentially the worst strategy if you want to make lots of groups per day
      // If the date is already taken then an error will be thrown.
      const found = config.migrationGroups.find(item => item.prefix === latestDate)
      if (found) {
        throw new Error(`Date ${latestDate} already exists. If you need granular change groups you should change to a different prefixStrategy.`)
      }
      config.migrationGroups.push({prefix: latestDate.toString()})
      fileName = makeFile(latestDate)
    }

    if (config.prefixStrategy === 'numeric') {
      const numeric = !config.migrationGroups.length
      ? makeNumeric(null)
      : makeNumeric(config.migrationGroups[config.migrationGroups.length - 1].prefix)
      console.log(numeric)
      config.migrationGroups.push({prefix: numeric})
      fileName = makeFile(numeric)
    }

    fs.writeFileSync(`${dir}/${config.migrationGroupsDir}/${fileName}`, yaml.stringify(newGroupConfig));
    fs.writeFileSync(ymlFileToUse, yaml.stringify(config));

    return;
  }

  if (action === Actions.build) {
    if (args["prefix"]) {
      const target = config.migrationGroups.find(
        (item) => item.prefix === args["prefix"]
      );
      if (!target) {
        throw new Error(`Prefix ${args["prefix"]} does not exist.`);
      }

      // Determine if it's a ts or yml
      // Need to determine if .ts parsing in this context is even possible.
      // The success has been flaky. It works locally, but not in docker.
      // It may fix itself when the package becomes installable from npm later
      const configFileTs = `${dir}/${config.migrationGroupsDir}/${target.prefix}_migrate.ts`;
      if (fs.existsSync(configFileTs)) {
        const changeSetConfig = require(configFileTs).changeSet;
        const parsed =
          docolate.MigrationManager.parseChangesetConfigConfig(changeSetConfig);
        docolate.MigrationManager.buildChangeSet(
          config,
          parsed,
          args["prefix"],
          curDir
        );
      }

      //yml case
      const configFileYml = `${dir}/${config.migrationGroupsDir}/${target.prefix}_migrate.yml`;
      if (fs.existsSync(configFileYml)) {
        const changeSetConfig = yaml.parse(
          fs.readFileSync(configFileYml).toString()
        );
        const parsed =
          docolate.MigrationManager.changesetConfigSchema.parse(
            changeSetConfig
          );
        docolate.MigrationManager.buildChangeSet(
          config,
          parsed,
          args["prefix"],
          curDir
        );
      }
      //yaml case
      const configFileYaml = `${dir}/${config.migrationGroupsDir}/${target.prefix}_migrate.yaml`;
      if (fs.existsSync(configFileYaml)) {
        const changeSetConfig = yaml.parse(
          fs.readFileSync(configFileYaml).toString()
        );
        const parsed =
          docolate.MigrationManager.changesetConfigSchema.parse(
            changeSetConfig
          );
        docolate.MigrationManager.buildChangeSet(
          config,
          parsed,
          args["prefix"],
          curDir
        );
      }
      //json case - probably won't happen as it'a difficult to write free-form commands
      //js case - will require making some jsdoc to help with types (or another method)
      //other consideration is do I just allow yaml only for simplicity...

      return;
    }
  }

  throw new Error("No valid action was provided.");
}

const curDir = process.cwd();

try {
  const action = process.argv[2] ?? null;
  const args = parseArgs(process.argv.slice(3));
  buildChangeSet(action, args, curDir);
} catch (error) {
  console.error(error);
}
