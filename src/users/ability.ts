import { AbilityBuilder, MongoAbility, ForcedSubject, createMongoAbility } from '@casl/ability'
import { type User, type Post } from '../db/schema'

type Actions = 'create' | 'read' | 'update' | 'delete'

// drizzle just gives us "POJO" objects.
// it's also not possible to "hook" into drizzle to help out CASL by setting a custom field automatically,
// so the best solution is to use the `subject` helper.
type Subjects =
  | 'User'
  | ForcedSubject<'User'>

  // not sure why we need ForcedSubject<T>, T, and 'T' to get typescript to work in `can()`
  | ForcedSubject<'Post'>
  | Post
  | 'Post'

type Ability = MongoAbility<[Actions, Subjects]>

export default function definiteAbilityFor(user?: User) {
  const { can, build } = new AbilityBuilder<Ability>(createMongoAbility)

  // anyone can read a post
  can('read', 'Post')

  if (user) {
    // a user can update their own post
    can('update', 'Post', { authorId: user.id })

    // a user can create a post
    can('create', 'Post')

    // a user can delete their own post
    can('delete', 'Post', { authorId: user.id })

    // can('read', 'User') // for admins
  }

  return build()
}
