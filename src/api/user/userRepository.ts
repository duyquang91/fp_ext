import { User, UserSchema } from '@/api/user/userModel';
import { mySQLQuery } from '@/common/middleware/sqlQuery';
import { logger } from '@/server';

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return await mySQLQuery('SELECT * FROM users')
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return await mySQLQuery(`SELECT name, email, token, cookie FROM users WHERE email = '${email}'`)
  },
}
