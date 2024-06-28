import { logger } from '@/server';
import mysql from 'mysql2/promise';
import { ZodSchema, object } from 'zod';

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

export async function mySQLQuery<T>(query: string): Promise<T | null> {
    const connection = await mysql.createConnection(connectionConfig)
    const [rows] = await connection.query(query);
    await connection.end();
    const jsonData =  JSON.stringify(rows)
    return jsonData === '[]' ? null : JSON.parse(jsonData)
}

export async function testConnection(): Promise<string> {
    try {
        const connection = await mysql.createConnection(connectionConfig)
        return 'Database is accessible'
      } catch(error) {
        return 'Database is not accessible'
      }
}