import { InferModel, eq } from 'drizzle-orm'
import * as argon2 from 'argon2'

import { db } from '../db'
import { users } from '../db/schema'

export function findById(id: number) {
	return db.select().from(users).where(eq(users.id, id)).get()
}

export function findAll() {
	return db.select().from(users).all()
}

type NewUser = InferModel<typeof users, 'insert'> & { password: string } // tbd: is this the right approach?

export async function create(values: NewUser) {
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
