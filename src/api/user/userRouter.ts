import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router, query } from 'express';
import { z } from 'zod';

import { GetUserSchema, UserSchema } from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'get',
    path: '/fp/users',
    tags: ['User'],
    request: { query: GetUserSchema.shape.query },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/', validateRequest(GetUserSchema), async (req: Request<{}, {}, {}, {email?:string}>, res: Response) => {
    if (req.query.email) {
      const serviceResponse = await userService.findByEmail(req.query.email);
      handleServiceResponse(serviceResponse, res);
    } else {
      const serviceResponse = await userService.findAll();
      handleServiceResponse(serviceResponse, res)
    }
  });

  return router;
})();
