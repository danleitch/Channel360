Documentation on Migrate Mongo.
[Migrate Mongo](https://www.npmjs.com/package/migrate-mongo) is a Node.js library that helps you to manage your MongoDB database migrations. It is a fork of [migrate](https://www.npmjs.com/package/migrate) which is a library for managing database schema migrations for Node.js.

## Installation.

```bash
$ npm install -g migrate-mongo
```

---

```bash
$ migrate-mongo
Usage: migrate-mongo [options] [command]


  Commands:

    init                  initialize a new migration project
    create [description]  create a new database migration with the provided description
    up [options]          run all unapplied database migrations
    down [options]        undo the last applied database migration
    status [options]      print the changelog of the database

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### Migration process

> Each micro service is responsible for it's own database and data. So, each micro service will have it's own migration process.

### Starting fresh.

if you already have a `migrate-mongo-config.js` then you can skip this

but to get a config file you can run

```bash
$ migrate-mongo init
```

this will create a `migrate-mongo-config.js` file in the root of your project.

### Creating a migration.

```bash
$ migrate-mongo create <description>
```

this will create a new migration file in the `migrations` folder.

### Running migrations.

```bash
$ migrate-mongo up
```

this will run all the migrations that are not yet applied to the database.

### Undoing migrations.

```bash
$ migrate-mongo down
```

this will undo the last migration that was applied to the database.

### Checking status.

```bash
$ migrate-mongo status
```

this will print the changelog of the database.

### Config file.

```js
module.exports = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: "mongodb://localhost:27017",

    // TODO Change this to your database name:
    databaseName: "migrate-mongo",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecation warning when connecting
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",
};
```

### Migration file.

```js
const { MongoClient } = require("mongodb");

/**
 * @param {MongoClient} db
 */
exports.up = async function (db) {
  // TODO write your migration here.
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
};

/**
 * @param {MongoClient} db
 */
exports.down = async function (db) {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
```

### Migrations folder.

```bash

├── migrations
│   ├── 20200527100000-create-users.js
│   ├── 20200527100001-create-posts.js
│   ├── 20200527100002-create-comments.js
│   └── 20200527100003-create-likes.js
├── migrate-mongo-config.js
└── package.json

```

### Changelog collection.

```bash
> db.changelog.find()
{ "_id" : ObjectId("5ecf0b5b9b9b9b9b9b9b9b9b"), "version" : 1, "name" : "20200527100000-create-users.js", "filename" : "20200527100000-create-users.js", "timestamp" : ISODate("2020-05-27T10:00:00.000Z") }
{ "_id" : ObjectId("5ecf0b5b9b9b9b9b9b9b9b9"), "version" : 2, "name" : "20200527100001-create-posts.js", "filename" : "20200527100001-create-posts.js", "timestamp" : ISODate("2020-05-27T10:00:00.000Z") }
{ "_id" : ObjectId("5ecf0b5b9b9b9b9b9b9b9ba"), "version" : 3, "name" : "20200527100002-create-comments.js", "filename" : "20200527100002-create-comments.js", "timestamp" : ISODate("2020-05-27T10:00:00.000Z") }
{ "_id" : ObjectId("5ecf0b5b9b9b9b9b9b9b9bb"), "version" : 4, "name" : "20200527100003-create-likes.js", "filename" : "20200527100003-create-likes.js", "timestamp" : ISODate("2020-05-27T10:00:00.000Z") }
```

### Migrations flow.

1. Create a new migration file.
2. Write the migration code.
3. Run the migration.
4. Check the status of the migration.
5. Undo the migration(if needed).

### References.

- [Migrate Mongo](https://www.npmjs.com/package/migrate-mongo)
- [Migrate](https://www.npmjs.com/package/migrate)
- [MongoDB](https://www.mongodb.com/)
