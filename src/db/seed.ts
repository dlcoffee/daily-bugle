import { sql } from 'drizzle-orm'
import { db } from './index'

import { createUser } from '../users/services'
	; (async () => {
		db.run(sql`DELETE FROM posts`)
		db.run(sql`DELETE FROM users`)

		await createUser({
			username: 'jjjameson',
			password: 'menace',
		})

		await createUser({
			username: 'pparker',
			password: 'joespizza',
		})
	})()
