import { MongoClient, UpdateResult } from 'mongodb'

import { convert, getPayloadFromCookie, InitUser, User } from '@/api/user/userModel'
import { mongoDBquery } from '@/common/middleware/mongoDBquery'
export const userRepository = {
  findAllAsync: async (userId?: string, group?: string): Promise<User[]> => {
    if (userId) {
      return (await mongoDBquery<User>('users', { userId: userId })) ?? []
    } else if (group) {
      return (
        (await mongoDBquery('users', { $or: [{ group: { $exists: false } }, { group: null }, { group: group }] })) ?? []
      )
    } else {
      return (await mongoDBquery('users', { $or: [{ group: { $exists: false } }, { group: null }] })) ?? []
    }
  },

  findByUserId: async (id: string): Promise<User | null> => {
    const results = (await mongoDBquery<User>('users', { userId: id })) ?? []
    return results[0] ?? null
  },

  createUser: async (initUser: InitUser): Promise<UpdateResult> => {
    let client: MongoClient | undefined
    try {
      const user = convert(initUser)
      client = new MongoClient(process.env.DB_CONNECTION_URI!)
      const db = client.db(process.env.DB_NAME)
      const col = db.collection('users')
      const json = await col.insertOne(user)
      return JSON.parse(JSON.stringify(json))
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      client?.close()
    }
  },

  updateUserCookie: async (cookie: string): Promise<UpdateResult> => {
    let client: MongoClient | undefined
    try {
      const { userId, authToken } = getPayloadFromCookie(cookie)

      client = new MongoClient(process.env.DB_CONNECTION_URI!)
      const db = client.db(process.env.DB_NAME)
      const col = db.collection('users')
      const json = await col.updateOne({ userId: userId }, { $set: { cookie: cookie, authToken: authToken } })
      return JSON.parse(JSON.stringify(json))
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      client?.close()
    }
  },

  updateUserToken: async (userId: string, token: string, cookie: string): Promise<UpdateResult | null> => {
    const client = new MongoClient(process.env.DB_CONNECTION_URI!)
    const db = client.db(process.env.DB_NAME)
    const col = db.collection('users')
    const json = await col.updateOne({ userId: userId }, { $set: { authToken: token, cookie: cookie } })
    client.close()
    return JSON.parse(JSON.stringify(json))
  },
}
