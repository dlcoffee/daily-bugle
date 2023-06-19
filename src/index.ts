import Fastify from 'fastify'

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

fastify.get('/', async (request, reply) => {
	reply.type('application/json').code(200)
	return { hello: 'world' }
})

fastify.get('/posts/:id', async (request, reply) => {
	return reply.code(200).send({
		data: [],
	})
})

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) throw err
	// Server is now listening on ${address}
})
