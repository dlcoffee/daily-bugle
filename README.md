# daily-bugle

testing out authorization. it'll most likely be API-only. may set up tests if i'm feeling up to it.

## technologies

- [fastify](https://github.com/fastify/fastify) - web framework. something other than express
- [drizzle-orm](https://github.com/drizzle-team/drizzle-orm) - trying the new kid on the block
- [casl](https://github.com/stalniy/casl) - js authz library. this may change depending on what library i want to test
- [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema) - didnt wanna deal with weird plugin stuff with fastify

## folder structure

```
src/ # source code (typescript)
  db/ # database configuration
  users/ # users domain
  posts/ # posts domain
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

- responsible for the "orm" functionality.
- use sqlite for fun. plus i don't have to set up postgres.

docs: https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md

### drizzle-kit

- handles migrations and "push" commands
- looks like because migrations are in sql, there's no worry about whether the migration is typescript
  javascript.
- looks like `push` for sqlite just got released: https://github.com/drizzle-team/drizzle-kit-mirror/releases/tag/v0.19.0

### zod-to-json-schema

didn't want to deal with weird plugin stuff with fastify

### CASL

an isomorphic authz library (can be used in browser and node.js environments). it is written in typescript.

it's very class heavy, requiring you to either adopt classes or mess around with `ForcedSubject` types. take a look at: https://casl.js.org/v6/en/package/casl-prisma#note-on-subject-helper.

**maybe** instead of mucking around with constructor naming or adding a new column, a typed id can be
leveraged to infer the type: https://github.com/jetpack-io/typeid.

the docs have important information hidden around pages.

- ABAC approach (you can still use roles if you want)
- the `can` is a confusing API because there are actually 2. (1) for a definition, and (2) for a question.

```js
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

// define abilities
const { can: allow, cannot: forbid, build } = new AbilityBuilder(createMongoAbility)

allow('read', 'Post')
forbid('read', 'Post', { private: true })

const ability = build()

// check abilities
ability.can('read', 'Post')
```

- `createMongoAbility` returns an instance of `PureAbility` with "mongo-like" conditions. see https://casl.js.org/v6/en/guide/conditions-in-depth#mongo-db-and-its-query-language. this seems to be the preferred/default way of using the library.
- `defineAbility` creates a `MongoAbility` instance

```js
import { defineAbility, createMongoAbility } from '@casl/ability'

const t1 = createMongoAbility([{ action: 'read', subject: 'Post' }])

console.log('t1 can?', t1.can('read', 'Post'))

const t2 = defineAbility((can) => {
  can('read', 'Post')
})

console.log('t2 can?', t2.can('read', 'Post'))
```
