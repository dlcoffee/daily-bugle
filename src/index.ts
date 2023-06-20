import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { eq } from 'drizzle-orm'

import { db } from './db'
import { posts } from './db/schema'

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

fastify.get('/posts', async (_request, reply) => {
	const results = db.select().from(posts).all()

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
		const result = db
			.select()
			.from(posts)
			.where(eq(posts.id, Number(request.params.id)))
			.get()

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
		const results = db
			.insert(posts)
			.values({
				message: request.body.message,
			})
			.returning()
			.all()

		return reply.code(201).send(results[0])
	}
)

fastify.listen({ port: 3000 }, (err, _address) => {
	if (err) throw err
	// Server is now listening on ${address}
})
