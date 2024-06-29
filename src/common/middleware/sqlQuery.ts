import { logger } from '@/server'
import { Collection, MongoClient } from 'mongodb'

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

export async function mongoDBquery<T>(collection: string, query: { [key: string]: any }): Promise<[T] | null> {
  const client = new MongoClient(process.env.DB_CONNECTION_URI!)
  try {
    const db = client.db(process.env.DB_NAME)
    const col = db.collection(collection)
    const json = await col.find(query).toArray()
    logger.info(json)
    return JSON.parse(JSON.stringify(json))
  } catch (error) {
    logger.error(error)
    return null
  } finally {
    client.close()
  }
}

export async function testConnection(): Promise<string> {
  try {
    if (!process.env.DB_CONNECTION_URI) {
      return 'DB_CONNECTION_URI is missing in .env'
    }
    const client = new MongoClient(process.env.DB_CONNECTION_URI!)
    await client.connect()
    return 'Database is accessible'
  } catch (error) {
    logger.error(error)
    return 'Database is not accessible'
  }
}
