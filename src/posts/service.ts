import { InferModel, eq } from 'drizzle-orm'

import { db } from '../db'
import { posts } from '../db/schema'

export function findById(id: number) {
  return db.select().from(posts).where(eq(posts.id, id)).get()
}

export function findAll() {
  return db.select().from(posts).all()
}

type NewPost = InferModel<typeof posts, 'insert'>

export function create(values: NewPost) {
  // note: return value is `values`, not a freshly pulled record (timestamps wont be returned)
  return db.insert(posts).values(values).returning().get()
}
