import { z } from 'zod'

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean
  message: string
  data: T
  statusCode: number

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number) {
    this.success = status === ResponseStatus.Success
    this.message = message
    this.data = responseObject
    this.statusCode = statusCode
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    statusCode: z.number(),
  })
