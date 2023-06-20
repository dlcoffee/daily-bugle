import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey(), // 'id' is the column name
	message: text('message'),
})
