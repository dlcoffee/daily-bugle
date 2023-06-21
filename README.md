# daily-bugle

testing out authorization. it'll most likely be API-only. may set up tests if i'm feeling up to it.

## technologies

- [fastify](https://github.com/fastify/fastify) - web framework. something other than express
- [drizzle-orm](https://github.com/drizzle-team/drizzle-orm) - trying the new kid on the block
- [casl](https://github.com/stalniy/casl) - js authz library. this may change depending on what library i want to test
- [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) - didn't want to deal with json schema

## folder structure

```
src/ # source code (typescript)
  db/ # database configuration
  index.ts # server config
migrations/ # drizzle-kit generated migration files
```

## how to run

```bash
npm install

## tbd: create the migrations
npm run db:migrate

## alternatively, just push
# npm run db:push

## generate fake data for messing around
npm run db:seed

```

### drizzle-orm

use sqlite for fun. plus i don't have to set up postgres.

trying out `drizzle-kit` as well for migrations.

docs: https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md

### drizzle-kit

looks like `push` just got released: https://github.com/drizzle-team/drizzle-kit-mirror/releases/tag/v0.19.0

```bash
## generate migration based on schema into the migrations/ directory
npm run db:generate

## actually run migrations
npm run db:migrate

## used for prototyping on a branch. once it looks good, use generate to create the migration
npm run db:push
```

looks like because migrations are in sql, there's no worry about whether the migration is typescript
javascript.

### fastify-type-provider-zod

didn't want to use (learn) json schema.
