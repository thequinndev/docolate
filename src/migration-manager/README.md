# Migration Manager
Simple and universal migration manager that leverages git history to build past and present database changesets.
```
npm i -g @thequinndev/docolate
```
## Migration Manager Config
For a brand new project run the following at the root of your project, with the prefix of your choice. The default prefixStrategy if not defined is ``timestamp``. The prefixStrategy will form as the ordering indicator of your DB changesets.

* timestamp - a numeric timestamp from the time (now)
    * "1740875890"
    * "1740875892"
* date - the date (now) in the form YYYYMMDD
    * "20250215"
    * "20250301"
* numeric - a zero-padded number starting from 1
    * "0000000001"
    * "0000000002"
```
docolate-migrate new --prefixStrategy=timestamp|date|numeric
```

### docolate-migrate.yml
This command will create a new file ``docolate-migrate.yml`` that looks like this:
```yaml
prefixStrategy: timestamp
outputDir: migrations
migrationGroupsDir: docolate-migrate
splitBy:
  none:
    upFileFormat: "{{prefix}}.up.sql"
    downFileFormat: "{{prefix}}.down.sql"
migrationGroups: []
```

At this stage, you are free to alter any of the default directories, or change your prefixStrategy.
* ``outputDir``: where your migration or patch files will be written to
* ``migrationGroupsDir``: where your migration group config files will live.
* ``splitBy`` - object - keys of none OR group - default key: none
    * ``none``
        * ``upFileFormat`` (optional) - string - default value: "{{prefix}}.up.sql"
        * ``downFileFormat`` (optional) - string - default value: "{{prefix}}.down.sql"
    * ``group``
        * ``upFileFormat`` (optional) - string - default value: "{{prefix}}\_{{increment}}\_{{groupName}}.up.sql"
        * ``downFileFormat`` (optional) - string - default value: "{{prefix}}\_{{increment}}\_{{groupName}}.down.sql"
#### splitBy
What is the difference?
* ``none`` - all of the groups change items will be merged into two single ``up.sql`` and ``down.sql`` files.
* ``group`` - all the change items from each group will be placed in their own respective ``up.sql`` and ``down.sql`` files
##### splitBy custom file formats
* ``prefix`` (``none`` & ``group``) - refers to the prefix designated for this changeset file
* ``increment`` (``group`` only) - refers to a unique number starting from 0 and incrementing up
    * more increment strategies could come at a later date, but for now this works.
* ``groupName`` (``group`` only) - refers to the groupName value specified for each group
You can define your own file formats

For ``splitBy: none``, the defaults look like
```
{{prefix}}.up.sql
{{prefix}}.down.sql
```
You may decide to have the scripts go into folders instead and with a different name.
* ``{{prefix}}`` is mandatory
```
{{prefix}}/forward.sql
{{prefix}}/rollback.sql
```

For ``splitBy: group``, the defaults look like
```
{{prefix}}_{{increment}}_{{groupName}}.up.sql
{{prefix}}_{{increment}}_{{groupName}}.down.sql
```
You may decide to have the scripts go into folders instead and with a different name.
* ``{{prefix}}`` is mandatory
* ``{{increment}}`` is mandatory
* ``{{groupName}}`` is mandatory
```
{{prefix}}_{{increment}}_{{groupName}}/forward.sql
{{prefix}}_{{increment}}_{{groupName}}/rollback.sql
```

## Migration Manager Migration Groups
The next logical question is, what is a migration group? Let's add one. Run the following.
```
docolate-migrate add
```

This will do 2 things:
1. The key ``migrationGroups`` inside ``docolate-migrate.yml`` will get a new item in its array.
    * The item prefix added will depend on your prefixStrategy
2. This will create a new file in your ``migrationGroupsDir``, that looks like this.
    * The file name will depend on your prefix.
```yaml
description: description
upRef: ref | null
downRef: ref | undefined (remove this key entirely for undefined)
changeItemGroups:
  - groupName: my_migration_action
    description: description
    changeItems: []

```
* ``description`` (optional) - string - The description for your patch or migration
* ``upRef`` (required) - string | null - The git ref that refers to the "up" (next/latest) target for your database. See ``"Valid refs"``
* ``downRef`` (optional) - string | undefined - The git ref that refers to the "down" (rollback/revert) target for your database. See ``"Valid refs"``.
    * ``Remove this key entirely if there is no downRef``
* ``changeItemGroups`` (required) - array of change items - See ``"Change items"``

See ``"Additional customization"`` below for more available keys.

### Valid refs
* A tag
    * '1.0.0'
    * 'v12.8.0-alpha'
* A branch
    * feature/add-a-table
    * main
* A commit hash
    * 3f440ce11aa660cebcdccd458e914e58b8e540c4
    * 3f440ce

### Change items
For a working example see [here](../../examples/migration-manager/docolate-migrate/20250215_migrate.yml)

A changeItemGroup is a group with a list of changes that relate to a particular entity. These consist of ``up`` and ``down`` operations. These allow you to scope your do & un-do changes together.

* groupName (required) string - a unique name that represents this group of changes
    * if you split by group it will form part of the filename so make sure it's appropriate and consistent with a file name.
    * a good format might be (create|update|delete)_entityType_entityName
description (optional) string - A description of the change group
changeItems - an array of up and down operations

#### Up and Down operations
* Up operations will happen in normal order
* Down operations will happen in reverse order

Operations can either come from a file or a command (cmd)
* ``cmd`` is just an array of commands to run
    * e.g. DROP TABLE departments;
    * e.g. INSERT INTO TABLE departments (department_id department_name) VALUES (1 'Finance');
* ``file`` is where ``git`` comes in
    * ``up`` files will run ``git show {{upRef}}:{{fileName}}``
        * If ``upRef`` is null, then the file system is used instead
    * ``down`` files will run ``git show {{downRef}}:{{fileName}}``
```yaml
upRef: feature/add-departments-table
# no downRef as there's no rollback state in git
changeItemGroups:
  - groupName: create_table_departments
    description: Departments table deployment
    # Group of changes related to the creation of the departments table
    changeItems:
        # UP -> Create the table
      - up:
          file:
            fileName: tables/departments.sql
        # DOWN -> DROP the table
        down:
          cmd:
            - DROP TABLE departments;
        # Seed the table
      - up:
          cmd:
            - INSERT INTO TABLE departments (department_id, department_name) VALUES (1, 'Finance');
        # Remove the seeded row
        down:
          cmd:
            - DELETE FROM departments WHERE department_id = 1;       
  - groupName: create_table_employees
    description: Employees table deployment
    # Group of changes related to the creation of the employees table  
    changeItems:
        # UP -> Create the table
      - up:
          file:
            fileName: tables/employees.sql
        # DOWN -> DROP the table
        down:
          cmd:
            - DROP TABLE employees;
```

#### Output
##### UP
```sql
-- BEGIN CHANGESET GROUP [create_table_department] --

/**

Description: Departments table deployment

*/



CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

INSERT INTO TABLE departments (department_id department_name) VALUES (1 'Finance');



-- END CHANGESET GROUP [create_table_department] --

-- BEGIN CHANGESET GROUP [create_table_employees] --

/**

Description: Employees table deployment

*/



CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);



-- END CHANGESET GROUP [create_table_employees] --
```
##### DOWN
```sql
-- BEGIN CHANGESET GROUP [create_table_employees] --

/**

Description: Employees table deployment

*/



DROP TABLE employees;



-- END CHANGESET GROUP [create_table_employees] --

-- BEGIN CHANGESET GROUP [create_table_department] --

/**

Description: Departments table deployment

*/



DELETE FROM departments WHERE department_id = 1;

DROP TABLE departments;



-- END CHANGESET GROUP [create_table_department] --
```