import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { Request, Response, Router } from 'express'
import {
  GetUserRequestSchema,
  InitUser,
  PostInitUserRequestSchema,
  RefreshCookieSchema,
  UpdateCookieSchema,
  UpdateUserCookieRequestSchema,
  UserSchema,
} from '@/api/user/userModel'
import { userService } from '@/api/user/userService'
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers'
import { logger } from '@/server'

export const userRegistry = new OpenAPIRegistry()

userRegistry.register('User', UserSchema)

export const userRouter: Router = (() => {
  const router = express.Router()

  userRegistry.registerPath({
    method: 'get',
    path: '/fp/users',
    tags: ['User'],
    responses: createApiResponse(UserSchema, 'Success'),
  })

  router.get('/', async (req: Request, res: Response) => {
    const serviceResponse = await userService.findAll()
    handleServiceResponse(serviceResponse, res)
  })

  userRegistry.registerPath({
    method: 'get',
    path: '/fp/users/{id}',
    tags: ['User'],
    request: { params: GetUserRequestSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  })

  router.get('/:id', validateRequest(GetUserRequestSchema), async (req: Request, res: Response) => {
    const serviceResponse = await userService.findByUserId(req.params.id)
    handleServiceResponse(serviceResponse, res)
  })

  userRegistry.registerPath({
    method: 'post',
    path: '/fp/users/create',
    tags: ['User'],
    request: {
      body: {
        description: 'Backend will parse the userId & authToken then create the user together',
        content: { 'application/json': { schema: PostInitUserRequestSchema.shape.body } },
      },
    },
    responses: createApiResponse(UserSchema, 'Success'),
  })

  router.post('/create', async (req: Request, res: Response) => {
    const serviceResponse = await userService.createUser(req.body)
    handleServiceResponse(serviceResponse, res)
  })

  userRegistry.registerPath({
    method: 'put',
    path: '/fp/users/update',
    tags: ['User'],
    request: {
      body: {
        description: 'Backend will parse the userId & authToken then update the user together',
        content: { 'application/json': { schema: UpdateUserCookieRequestSchema.shape.body } },
      },
    },
    responses: createApiResponse(UserSchema, 'Success'),
  })

  router.put('/update', async (req: Request, res: Response) => {
    const serviceResponse = await userService.updateUserCookie(req.body['cookie'])
    handleServiceResponse(serviceResponse, res)
  })

  userRegistry.registerPath({
    method: 'get',
    path: '/fp/users/refreshToken/{userId}',
    tags: ['User'],
    request: {
      params: RefreshCookieSchema.shape.params
    },
    responses: createApiResponse(UserSchema, 'Success'),
  })

  router.get('/refreshToken/:userId', async (req: Request, res: Response) => {
    const serviceResponse = await userService.refreshToken(req.params.userId)
    handleServiceResponse(serviceResponse, res)
  })

  return router
})()
