import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { mongoDBquery, testConnection } from '@/common/middleware/sqlQuery';

export const healthCheckRegistry = new OpenAPIRegistry();

export const healthCheckRouter: Router = (() => {
  const router = express.Router();

  healthCheckRegistry.registerPath({
    method: 'get',
    path: '/fp/health-check',
    tags: ['Health Check'],
    responses: createApiResponse(z.null(), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const dbStatus = await testConnection()
    const serviceResponse = new ServiceResponse(ResponseStatus.Success, `Service is running and ${dbStatus}`, null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
