import { AbilityBuilder, MongoAbility, ForcedSubject, createMongoAbility } from '@casl/ability'
import { type User, type Post } from '../db/schema'

type Actions = 'create' | 'read' | 'update' | 'delete'

// Q: how will CASL work if we've got these attributes?
// export const PERMISSIONS = [
//   'system_admin',
//   'posts.create',
//   'posts.read',
//   'posts.update',
//   'posts.delete',
//   'users.create',
//   'users.read',
//   'users.update',
//   'users.delete',
// ] as const

type Subjects =
  | 'User'
  | ForcedSubject<'User'>

  // not sure why we need ForcedSubject<T>, T, and 'T' to get typescript to work in `can()`
  | ForcedSubject<'Post'>
  | Post
  | 'Post'

export default function definiteAbilityFor(user?: User) {
  // defining rules via the `AbilityBuilder` is the preferred DSL. by passing in `createMongoAbility`,
  // we get an instance of a `MongoAbility`, which is an instance of `PureAbility` with mongo rule
  // syntax
  const { can, build } = new AbilityBuilder<MongoAbility<[Actions, Subjects]>>(createMongoAbility)

  // part 1: using the `Subject` as a second parameter.
  // anyone can read a post
  can('read', 'Post')

  if (user) {
    // a user can update their own post
    can('update', 'Post', { authorId: user.id })

    // a user can create a post
    can('create', 'Post')

    // a user can delete their own post
    can('delete', 'Post', { authorId: user.id })
  }

  // part 2: using existing permissions on the user
  // if (user) {
  // 	if (user.permissions.includes('users.create') {
  // 		can('create', 'User')
  // 	}
  // }

  return build()
}
