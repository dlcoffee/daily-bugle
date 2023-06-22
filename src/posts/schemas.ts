import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const createPostBodySchema = z.object({
  message: z.string(),
})

export type CreatePostBody = z.infer<typeof createPostBodySchema>

export const createPostJsonSchema = {
  body: zodToJsonSchema(createPostBodySchema, 'createPostBodySchema'),
}

const getPostByIdParamsSchema = z.object({
  id: z.string(),
})

export type GetPostByIdParams = z.infer<typeof getPostByIdParamsSchema>

export const getPostByIdJsonSchema = {
  params: zodToJsonSchema(getPostByIdParamsSchema, 'getPostByIdParamsSchema'),
}
