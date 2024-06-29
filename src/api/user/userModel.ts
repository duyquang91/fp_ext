import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';
import { email } from 'envalid';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  name: z.string().min(1),
  userId: z.string(),
  email: z.string().email(),
  token: z.string().min(0),
  cookie: z.string().min(0)
});

// Input Validation for 'GET users/:email' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
});
