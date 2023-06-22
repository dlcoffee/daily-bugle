import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const createUserBodySchema = z.object({
	username: z.string(),
	password: z.string(),
})

export type CreateUserBody = z.infer<typeof createUserBodySchema>

export const createUserJsonSchema = {
	body: zodToJsonSchema(createUserBodySchema, 'createUserBodySchema'),
}

const getUserByIdParamsSchema = z.object({
	id: z.string(),
})

export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>

export const getUserByIdJsonSchema = {
	params: zodToJsonSchema(getUserByIdParamsSchema, 'getUserByIdParamsSchema'),
}
