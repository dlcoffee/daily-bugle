import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import fastifyAuth, { FastifyAuthFunction } from '@fastify/auth'
import { subject } from '@casl/ability'
import * as argon2 from 'argon2'

import { type User } from './db/schema'
import { findPostById, findAllPosts, createPost, updatePost } from './posts/services'
import { findUserByUsername, findUserById, findAllUsers, createUser } from './users/services'
import definiteAbilityFor from './users/ability'

import {
  getUserByIdJsonSchema,
  createUserJsonSchema,
  type CreateUserBody,
  type GetUserByIdParams,
} from './users/schemas'

import {
  getPostByIdJsonSchema,
  createPostJsonSchema,
  patchPostByIdJsonSchema,
  type CreatePostBody,
  type GetPostByIdParams,
  type PatchPostByIdParams,
  type PatchPostByIdBody,
} from './posts/schemas'

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: FastifyAuthFunction
  }

  interface FastifyRequest {
    user?: User
  }
}

const fastify = Fastify({
  logger:
    process.env.NODE_ENV === 'production'
      ? true
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        },
})

fastify
  .decorateRequest('user', null)
  .decorate('authenticate', async function (request: FastifyRequest, _reply: FastifyReply) {
    const { authorization } = request.headers

    const base64string = authorization?.split('Basic ')?.[1]

    if (!base64string) {
      throw new Error('missing authorization header')
    }

    const bufferObj = Buffer.from(base64string, 'base64')
    const decodedString = bufferObj.toString('utf8')

    const delimiter = ':'
    const [username, ...restOfPassword] = decodedString.split(delimiter)
    const password = restOfPassword.join(delimiter)

    const user = findUserByUsername(username)

    if (!user) {
      throw new Error('user cannot be found')
    }

    if (!user.password) {
      throw new Error('user did not complete registration')
    }

    if (!(await argon2.verify(user.password, password))) {
      throw new Error('invalid password')
    }

    request.user = user
  })
  .register(fastifyAuth)
  .after(() => {
    fastify.get('/', async (_request, reply) => {
      reply.type('application/json').code(200)
      return { hello: 'world' }
    })

    fastify.get(
      '/users',
      {
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (_request, reply) => {
        const results = findAllUsers()

        return reply.code(200).send(results)
      }
    )

    fastify.get<{ Params: GetUserByIdParams }>(
      '/users/:id',
      {
        schema: getUserByIdJsonSchema,
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (request: FastifyRequest<{ Params: GetUserByIdParams }>, reply: FastifyReply) => {
        const result = findUserById(Number(request.params.id))

        if (result) {
          return reply.code(200).send(result)
        }

        return reply.code(404).send({})
      }
    )

    fastify.post<{ Body: CreateUserBody }>(
      '/users',
      {
        schema: createUserJsonSchema,
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
        const result = await createUser({ username: request.body.username, password: request.body.username })
        return reply.code(201).send(result)
      }
    )

    fastify.get(
      '/posts',
      {
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (_request, reply) => {
        const results = findAllPosts()

        return reply.code(200).send(results)
      }
    )

    fastify.get<{ Params: GetPostByIdParams }>(
      '/posts/:id',
      {
        schema: getPostByIdJsonSchema,
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (request: FastifyRequest<{ Params: GetPostByIdParams }>, reply: FastifyReply) => {
        const user = request.user

        if (!user) {
          return reply.code(403).send({})
        }

        const ability = definiteAbilityFor(user)
        const post = findPostById(Number(request.params.id))

        // this is an example of resource level checks.
        // NOTE: `subject` is required here because we're dealing with POJO
        if (ability.cannot('read', subject('Post', post))) {
          return reply.code(403).send({})
        }

        if (post) {
          return reply.code(200).send(post)
        }

        return reply.code(404).send({})
      }
    )

    fastify.post<{ Body: CreatePostBody }>(
      '/posts',
      {
        schema: createPostJsonSchema,
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (request: FastifyRequest<{ Body: CreatePostBody }>, reply: FastifyReply) => {
        const user = request.user

        if (!user) {
          return reply.code(403).send({})
        }

        const ability = definiteAbilityFor(user)

        if (ability.cannot('create', 'Post')) {
          return reply.code(403).send({})
        }

        const result = createPost({ message: request.body.message })
        return reply.code(201).send(result)
      }
    )

    fastify.patch<{ Body: PatchPostByIdBody; Params: PatchPostByIdParams }>(
      '/posts/:id',
      {
        schema: patchPostByIdJsonSchema,
        onRequest: fastify.auth([fastify.authenticate]),
      },
      async (
        request: FastifyRequest<{ Body: PatchPostByIdBody; Params: PatchPostByIdParams }>,
        reply: FastifyReply
      ) => {
        const user = request.user

        if (!user) {
          return reply.code(403).send({})
        }

        const ability = definiteAbilityFor(user)
        let post = findPostById(Number(request.params.id))

        // this is an example of resource level checks.
        // NOTE: `subject` is required here because we're dealing with POJO
        if (ability.cannot('update', subject('Post', post))) {
          return reply.code(403).send({})
        }

        updatePost(post.id, request.body.message)
        post = findPostById(post.id)

        return reply.code(200).send(post)
      }
    )
  })

fastify.listen({ port: 3000 }, (err, _address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
