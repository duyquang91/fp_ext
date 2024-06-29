import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'
import { logger } from '@/server'

extendZodWithOpenApi(z)

export type User = z.infer<typeof UserSchema>
export const UserSchema = z.object({
  name: z.string().min(1),
  userId: z.string(),
  email: z.string().email(),
  authToken: z.string().min(0),
  cookie: z.string().min(0),
})

// Input Validation for 'GET users/:email' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
})

export type InitUser = z.infer<typeof InitUserSchema>
export const InitUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cookie: z.string().min(1),
})

// Input Validation for 'POST users/update' endpoint
export const PostInitUserSchema = z.object({
  body: InitUserSchema,
})

export type UpdateCookie = z.infer<typeof UpdateCookieSchema>
export const UpdateCookieSchema = z.object({
  cookie: z.string().min(1),
})

// Input Validation for 'POST users/update' endpoint
export const UpdateUserCookieSchema = z.object({
  body: UpdateCookieSchema,
})

export function convert(initUser: InitUser): User {
  try {
    const user = InitUserSchema.parse(initUser)
    const token = user.cookie
      .trim()
      .split('; ')
      .map((e) => e.split('='))
      .find((e) => {
        return e[0] === 'token'
      })?.[1]
    if (token) {
      const jwt = jwtDecode<{ user_id: string; client_id: string; expires: number }>(token)
      if (jwt.client_id != 'corporate') {
        throw new Error('This account is not corporate type')
      }
      return {
        name: initUser.name,
        email: initUser.email,
        authToken: token,
        cookie: initUser.cookie,
        userId: jwt.user_id,
      }
    } else {
      throw new Error('Token is missing from cookie')
    }
  } catch (error) {
    throw error
  }
}

export function getUserIdFromCookie(cookie: string): string | undefined {
  logger.info(cookie)
  const token = cookie
    .trim()
    .split('; ')
    .map((e) => e.split('='))
    .find((e) => {
      return e[0] === 'token'
    })?.[1]

  if (token || token?.trim() === '') {
    const jwt = jwtDecode<{ user_id: string; client_id: string; expires: number }>(token)
    if (jwt.client_id != 'corporate') {
      throw new Error('This account is not corporate type')
    }
    if (jwt.expires <= Date.now()) {
      throw new Error('Token is already expired')
    }
    if (!jwt.user_id) {
      throw new Error('user id is not found')
    }
    return jwt.user_id
  } else {
    throw new Error('Token is not found')
  }
}
