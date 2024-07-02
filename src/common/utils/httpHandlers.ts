import { Response } from 'express'

import { ServiceResponse } from '@/common/models/serviceResponse'

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse)
}

// const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
//   try {
//     schema.parse({ body: req.body, query: req.query, params: req.params })
//     next()
//   } catch (err) {
//     const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`
//     const statusCode = StatusCodes.BAD_REQUEST
//     res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode))
//   }
// }
