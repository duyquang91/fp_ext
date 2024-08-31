import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { UpdateResult } from 'mongodb'

import { getPayloadFromCookie, InitUser, isTokenExpired, User } from '@/api/user/userModel'
import { userRepository } from '@/api/user/userRepository'
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'
import parseCookies, { update } from '@/common/utils/cookiePaser'
import { logger } from '@/server'

export const userService = {
  // Retrieves all users from the database
  findAll: async (userId?: string, group?: string, shareWith?: string): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync(userId, group, shareWith)
      return new ServiceResponse(ResponseStatus.Success, 'Users found', users, StatusCodes.OK)
    } catch (ex) {
      const errorMessage = `Error finding all users: ${ex}`
      logger.error(errorMessage)
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
    }
  },

  // Retrieves a single user by their ID
  findByUserId: async (id: string): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByUserId(id)
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND)
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK)
    } catch (ex) {
      const errorMessage = `User: ${id} is not found by error: ${(ex as Error).message}`
      logger.error(errorMessage)
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
    }
  },

  createUser: async (initUser: InitUser): Promise<ServiceResponse<UpdateResult | null>> => {
    try {
      const { userId } = getPayloadFromCookie(initUser.cookie)
      const user = await userRepository.findByUserId(userId)
      console.log('-----> ', user)
      if (user) {
        console.log(`-----> User (${userId}) already exist`)
        throw Error(`User (${userId}) already exist`)
      }
      const result = await userRepository.createUser(initUser)
      if (!result.acknowledged) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to create this user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      } else {
        return new ServiceResponse(ResponseStatus.Success, 'User is created', result, StatusCodes.OK)
      }
    } catch (ex) {
      const errorMessage = `User is not created by error: ${(ex as Error).message}`
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
    }
  },

  updateUserCookie: async (userCookie: string): Promise<ServiceResponse<UpdateResult | null>> => {
    try {
      const result = await userRepository.updateUserCookie(userCookie)
      if (result.matchedCount === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User is not found', null, StatusCodes.NOT_FOUND)
      } else if (result.modifiedCount === 1) {
        return new ServiceResponse(ResponseStatus.Success, 'User is updated', null, StatusCodes.OK)
      } else {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Cookie is not updated. Maybe the same value',
          result,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }
    } catch (ex) {
      const errorMessage = `User is not updated by error: ${(ex as Error).message}`
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
    }
  },

  refreshToken: async (userId: string): Promise<ServiceResponse<string | null>> => {
    try {
      const user = await userRepository.findByUserId(userId)
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User is not found, need to create first',
          null,
          StatusCodes.BAD_REQUEST
        )
      }
      if (user.cookie === '') {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User found but cookie is unavailable. Ask owner to update',
          null,
          StatusCodes.BAD_REQUEST
        )
      }
      if (!isTokenExpired(user.authToken)) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Token is still valid, no need to refresh',
          user.authToken,
          StatusCodes.BAD_REQUEST
        )
      }
      const cookie = user.cookie
      const res = await axios.get('https://www.foodpanda.sg', {
        headers: {
          Host: 'www.foodpanda.sg',
          Cookie: cookie,
          'sec-ch-ua': '"Brave";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
          'cache-control': 'max-age=0',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'upgrade-insecure-requests': '1',
          'sec-gpc': '1',
          'accept-language': 'en-GB,en;q=0.7',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-user': '?1',
          'sec-fetch-dest': 'document',
          referer: 'https://www.foodpanda.sg/',
        },
      })

      const newCookie = res.headers['set-cookie']
      const newCookieStr = newCookie?.join(', ') ?? 'Empty cookie'

      if (!newCookie) {
        return new ServiceResponse(ResponseStatus.Failed, 'No cookie from response', null, StatusCodes.BAD_REQUEST)
      }

      const newParsedCookie = parseCookies(newCookieStr)
      const token = newParsedCookie.find((e) => e.cookieName === 'token')?.cookieValue

      if (!token || token === '') {
        return new ServiceResponse(ResponseStatus.Failed, 'No token from cookie', newCookieStr, StatusCodes.BAD_REQUEST)
      }

      await userRepository.updateUserToken(userId, token, update(newParsedCookie, user.cookie))
      return new ServiceResponse(ResponseStatus.Success, 'Success to refresh to token', token, StatusCodes.OK)
    } catch (error) {
      return new ServiceResponse(ResponseStatus.Failed, (error as Error).message, null, StatusCodes.BAD_REQUEST)
    }
  },
}
