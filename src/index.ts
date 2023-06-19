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

fastify.get('/', async (_request, reply) => {
	reply.type('application/json').code(200)
	return { hello: 'world' }
})

type Post = {
	id: number
	message: string
}

let currId = 1
const data: Post[] = [{ id: currId, message: 'test data' }]

fastify.get('/posts', async (_request, reply) => {
	return reply.code(200).send({
		data,
	})
})

fastify.get('/posts/:id', async (_request, reply) => {
	return reply.code(200).send({
		data,
	})
})

fastify.post('/posts', async (request, reply) => {
	data.push({
		id: ++currId,
		message: (request.body as { message: string }).message,
	})

	return reply.code(201).send({
		data: data[data.length - 1],
	})
})

fastify.listen({ port: 3000 }, (err, _address) => {
	if (err) throw err
	// Server is now listening on ${address}
})
