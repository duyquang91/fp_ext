import { User, UserSchema } from '@/api/user/userModel'
import { mongoDBquery } from '@/common/middleware/sqlQuery'
import { logger } from '@/server'

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return (await mongoDBquery('users', {})) ?? []
  },

  findByUserId: async (id: string): Promise<User | null> => {
    const results = (await mongoDBquery<User>('users', { userId: id })) ?? []
    return results[0] ?? null
  },
}
