import { MongoClient } from 'mongodb'

import { logger } from '@/server'

export async function mongoDBquery<T>(
  collection: string,
  query: { [key: string]: any },
  projection: { [key: string]: 0 | 1 }
): Promise<T[] | null> {
  const client = new MongoClient(process.env.DB_CONNECTION_URI!)
  try {
    const db = client.db(process.env.DB_NAME)
    const col = db.collection(collection)
    const json = await col.find(query, { projection: projection }).toArray()
    logger.info(json)
    return JSON.parse(JSON.stringify(json))
  } catch (error) {
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
