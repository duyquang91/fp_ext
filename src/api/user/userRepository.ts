import { InitUser, RefreshCookie, User, UserSchema, convert, getUserIdFromCookie } from '@/api/user/userModel'
import { mongoDBquery } from '@/common/middleware/sqlQuery'
import { logger } from '@/server'
import { query } from 'express'
import { MongoClient, UpdateOptions, UpdateResult } from 'mongodb'
import { object } from 'zod'

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return (await mongoDBquery('users', {})) ?? []
  },

  findByUserId: async (id: string): Promise<User | null> => {
    const results = (await mongoDBquery<User>('users', { userId: id })) ?? []
    return results[0] ?? null
  },

  createUser: async (initUser: InitUser): Promise<UpdateResult | null> => {
    var client: MongoClient | undefined
    try {
      const user = convert(initUser)
      client = new MongoClient(process.env.DB_CONNECTION_URI!)
      const db = client.db(process.env.DB_NAME)
      const col = db.collection('users')
      const json = await col.insertOne(user)
      return JSON.parse(JSON.stringify(json))
    } catch (error) {
      throw error
    } finally {
      client?.close()
    }
  },

  updateUserCookie: async (cookie: string): Promise<UpdateResult | null> => {
    var client: MongoClient | undefined
    try {
      const userId = getUserIdFromCookie(cookie)
      client = new MongoClient(process.env.DB_CONNECTION_URI!)
      const db = client.db(process.env.DB_NAME)
      const col = db.collection('users')
      const json = await col.updateOne({ userId: userId }, { $set: { cookie: cookie } })
      return JSON.parse(JSON.stringify(json))
    } catch (error) {
      throw error
    } finally {
      client?.close()
    }
  },
}
