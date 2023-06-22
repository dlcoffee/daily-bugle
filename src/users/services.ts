import { InferModel, eq } from 'drizzle-orm'
import * as argon2 from 'argon2'

import { db } from '../db'
import { users } from '../db/schema'

export function findUserById(id: number) {
  return db
    .select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .get()
}

export function findUserByUsername(username: string) {
  return db.select().from(users).where(eq(users.username, username)).get()
}

export function findAllUsers() {
  return db.select().from(users).all()
}

type NewUser = InferModel<typeof users, 'insert'> & { password: string } // tbd: is this the right approach?

export async function createUser(values: NewUser) {
  const hashed = await argon2.hash(values.password)

  // note: return value is `values`, not a freshly pulled record (timestamps wont be returned)
  return db
    .insert(users)
    .values({
      ...values,
      password: hashed,
    })
    .returning({
      id: users.id,
      username: users.username,
    })
    .get()
}
