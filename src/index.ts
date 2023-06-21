import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { findPostById, findAllPosts, createPost } from './posts/service'
import { findUserById, findAllUsers, createUser } from './users/service'

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

// Add schema validator and serializer
fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

fastify.get('/', async (_request, reply) => {
	reply.type('application/json').code(200)
	return { hello: 'world' }
})

fastify.get('/users', async (_request, reply) => {
	const results = findAllUsers()

	return reply.code(200).send(results)
})

fastify.withTypeProvider<ZodTypeProvider>().get(
	'/users/:id',
	{
		schema: {
			params: z.object({
				id: z.string(),
			}),
		},
	},
	async (request, reply) => {
		const result = findUserById(Number(request.params.id))

		if (result) {
			return reply.code(200).send(result)
		}

		return reply.code(404).send({})
	}
)

fastify.withTypeProvider<ZodTypeProvider>().post(
	'/users',
	{
		schema: {
			body: z.object({
				username: z.string(),
				password: z.string(),
			}),
		},
	},
	async (request, reply) => {
		const result = await createUser({ username: request.body.username, password: request.body.username })
		return reply.code(201).send(result)
	}
)

fastify.get('/posts', async (_request, reply) => {
	const results = findAllPosts()

	return reply.code(200).send(results)
})

fastify.withTypeProvider<ZodTypeProvider>().get(
	'/posts/:id',
	{
		schema: {
			params: z.object({
				id: z.string(),
			}),
		},
	},
	async (request, reply) => {
		const result = findPostById(Number(request.params.id))

		if (result) {
			return reply.code(200).send(result)
		}

		return reply.code(404).send({})
	}
)

fastify.withTypeProvider<ZodTypeProvider>().post(
	'/posts',
	{
		schema: {
			body: z.object({
				message: z.string(),
			}),
		},
	},
	async (request, reply) => {
		const result = createPost({ message: request.body.message })
		return reply.code(201).send(result)
	}
)

fastify.listen({ port: 3000 }, (err, _address) => {
	if (err) throw err
	// Server is now listening on ${address}
})
