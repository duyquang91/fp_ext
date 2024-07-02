import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { jwtDecode } from 'jwt-decode'
import { z } from 'zod'

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
export const GetUserRequestSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    group: z.string().optional(),
  }),
})

export type InitUser = z.infer<typeof InitUserSchema>
export const InitUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cookie: z.string().min(1),
})

// Input Validation for 'POST users/update' endpoint
export const PostInitUserRequestSchema = z.object({
  body: InitUserSchema,
})

export type RefreshCookie = z.infer<typeof RefreshCookieSchema>
export const RefreshCookieSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
})

export type UpdateCookie = z.infer<typeof UpdateCookieSchema>
export const UpdateCookieSchema = z.object({
  cookie: z.string().min(1),
})

// Input Validation for 'POST users/update' endpoint
export const UpdateUserCookieRequestSchema = z.object({
  body: UpdateCookieSchema,
})

export function convert(initUser: InitUser): User {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = InitUserSchema.parse(initUser)
    const token = user.cookie
      .trim()
      .split(';')
      .map((e) => e.split('='))
      .find((e) => {
        return e[0].trim() === 'token'
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

export function getPayloadFromCookie(cookie: string): { userId: string; authToken: string } {
  const token = cookie
    .trim()
    .split(';')
    .map((e) => e.split('='))
    .find((e) => {
      return e[0].trim() === 'token'
    })?.[1]

  if (token || token?.trim() === '') {
    const jwt = jwtDecode<{ user_id: string; client_id: string; expires: number }>(token)
    if (jwt.client_id != 'corporate') {
      throw new Error('This account is not corporate type')
    }
    if (jwt.expires <= Date.now() / 1000) {
      throw new Error('Token is already expired')
    }
    if (!jwt.user_id) {
      throw new Error('user id is not found')
    }
    return { userId: jwt.user_id, authToken: token }
  } else {
    throw new Error('Token is not found')
  }
}

export function isCookieTokenExpired(cookie: string): boolean {
  const token = cookie
    .trim()
    .split(';')
    .map((e) => e.split('='))
    .find((e) => {
      return e[0].trim() === 'token'
    })?.[1]

  if (token || token?.trim() === '') {
    const jwt = jwtDecode<{ user_id: string; client_id: string; expires: number }>(token)
    if (jwt.client_id != 'corporate') {
      throw new Error('This account is not corporate type')
    }
    if (jwt.expires <= Date.now()) {
      return true
    }
    if (!jwt.user_id) {
      throw new Error('user id is not found')
    }
    return false
  } else {
    throw new Error('Token is not found')
  }
}
