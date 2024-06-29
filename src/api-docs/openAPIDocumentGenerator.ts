import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter'
import { userRegistry } from '@/api/user/userRouter'

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry])
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: 'beta',
      title: '🐼 Food Panda Killer APIs',
      description: "This service is using by OKX's staffs internally. DO NOT public!!!",
    }
  })
}
