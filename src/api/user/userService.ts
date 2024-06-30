import { StatusCodes } from 'http-status-codes'

import {
  InitUser,
  UpdateCookie,
  User,
  UserSchema,
  getUserIdFromCookie,
  isCookieTokenExpired,
} from '@/api/user/userModel'
import { userRepository } from '@/api/user/userRepository'
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'
import { UpdateResult } from 'mongodb'
import axios from 'axios'

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync()
      if (users.length == 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND)
      }
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
      const result = await userRepository.createUser(initUser)
      if (!result || !result.acknowledged) {
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
      if (!result || !result.acknowledged) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to update this user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      } else if (result.matchedCount === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User is not found', null, StatusCodes.NOT_FOUND)
      } else if (result.modifiedCount === 1) {
        return new ServiceResponse(ResponseStatus.Success, 'User is updated', null, StatusCodes.OK)
      } else {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to update this user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }
    } catch (ex) {
      const errorMessage = `User is not updated by error: ${(ex as Error).message}`
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
    }
  },

  refreshCookie: async (cookie: string): Promise<ServiceResponse<string | null>> => {
    try {
      // if (!isCookieTokenExpired(cookie)) {
      //   return new ServiceResponse(ResponseStatus.Success, 'Token is still valid, no need to refresh', null, StatusCodes.OK)
      // }
      const res = await axios.get('https://www.foodpanda.sg', {
        headers: {
          referer: 'https://www.foodpanda.sg/',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'navigate',
          'upgrade-insecure-requests': '1',
          'sec-gpc': '1',
          'sec-ch-ua': '"Brave";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
          'sec-fetch-dest': 'document',
          'sec-fetch-user': '?1',
          connection: 'keep-alive',
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          Cookie: cookie,
          'cache-control': 'max-age=0',
          Host: 'www.foodpanda.sg',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        },
      })
      logger.info(res.headers)
      return new ServiceResponse(
        ResponseStatus.Success,
        'Success to refresh to cookie',
        res.headers['set-cookie']!.join(';'),
        StatusCodes.OK
      )
    } catch (error) {
      return new ServiceResponse(ResponseStatus.Failed, (error as Error).message, null, StatusCodes.BAD_REQUEST)
    }
  },
}
