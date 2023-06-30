import { AbilityBuilder, MongoAbility, createMongoAbility, subject, ForcedSubject } from '@casl/ability'

type Actions = 'create' | 'read' | 'update' | 'delete'
type Subjects = 'Article' | 'Comment' | 'User'
// type AppAbility = Ability<[Actions, Subjects]>
type MAbility = MongoAbility<[Actions, Subjects]>

// const { can, cannot } = new AbilityBuilder<AppAbility>() // OLD API, it requires a parameter!

const ability = createMongoAbility<[Actions, Subjects]>() // this create a "MongoAbility"

ability.can('create', 'Article')

const _test = new AbilityBuilder<MAbility>(createMongoAbility)

// createMongoAbility === defineAbility????

///////////////////////////////////////////////////////////////////////

interface Article {
  id: number
  title: string
  content: string
  authorId: number
}

interface User {
  id: number
  name: string
}

type Action = 'create' | 'read' | 'update' | 'delete'
type Subject = Article | 'Article' | ForcedSubject<'Article'>

const abilityFor = (_user: User) => {
  const a = new AbilityBuilder<MongoAbility<[Action, Subject]>>(createMongoAbility)
  a.can('read', 'Article')
  return a.build()
}

const user: User = {
  id: 1,
  name: 'me',
}

const article: Article = {
  id: 1,
  title: 'article',
  content: 'content',
  authorId: 1,
}

const a = abilityFor(user)
console.log('test1', a.can('read', article))

class Article {}
const a2 = new Article()
console.log('test2', a.can('read', a2))

const a3 = {}
console.log('test2', a.can('read', subject('Article', a3))) // needs ForcedSubject typing
