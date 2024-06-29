import { StatusCodes } from 'http-status-codes'

import { InitUser, UpdateCookie, User, UserSchema } from '@/api/user/userModel'
import { userRepository } from '@/api/user/userRepository'
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'
import { UpdateResult } from 'mongodb'

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
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
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
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
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
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
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
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  },
}
