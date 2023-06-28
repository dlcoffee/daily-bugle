import { sql } from 'drizzle-orm'
import { db } from './index'

import { createUser } from '../users/services'
import { createPost } from '../posts/services'
;(async () => {
  db.run(sql`DELETE FROM posts`)
  db.run(sql`DELETE FROM users`)

  await createUser({
    username: 'jjjameson',
    password: 'menace',
  })

  const pparker = await createUser({
    username: 'pparker',
    password: 'joespizza',
  })

  await createPost({
    message: 'hi my name is peter',
    authorId: pparker.id,
  })
})()
