import { InferModel, eq } from 'drizzle-orm'

import { db } from '../db'
import { users } from '../db/schema'

export function findById(id: number) {
	return db.select().from(users).where(eq(users.id, id)).get()
}

export function findAll() {
	return db.select().from(users).all()
}

type NewUser = InferModel<typeof users, 'insert'>

export function create(values: NewUser) {
	return db.insert(users).values(values).returning().get()
}
