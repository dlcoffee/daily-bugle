import { sql } from 'drizzle-orm'
import { db } from './index'

import { createUser } from '../users/services'
import { createPost } from '../posts/services'
  ; (async () => {
    db.run(sql`DELETE FROM posts`)
    db.run(sql`DELETE FROM users`)

    await createUser({
      username: 'jjjameson',
      password: 'menace',
      permissions: [
        'system_admin',
        'posts.create',
        'posts.read',
        'posts.update',
        'posts.delete',
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
      ].join(','),
    })

    const pparker = await createUser({
      username: 'pparker',
      password: 'joespizza',
      permissions: ['posts.create', 'posts.read', 'posts.update', 'posts.delete'].join(','),
    })

    createPost({
      message: 'hi my name is peter',
      authorId: pparker.id,
    })
  })()
