import { User } from '@/api/user/userModel';
import mysql from 'mysql2/promise';

export const users: User[] = [
  { name: 'Alice', email: 'alice@example.com', token: '', cookie: '' },
  { name: 'Bob', email: 'bob@example.com', token: '', cookie: '' },
];

const connectionConfig = {
  host: 'stevedao.xyz',
  user: 'steve',
  password: 'Huyhoang@2015',
  database: 'food_panda'
};

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    try {
      const connection = await mysql.createConnection(connectionConfig)
      const [rows, fields] = await connection.query('SELECT * FROM users');
      const jsonData = JSON.stringify(rows);
      await connection.end();
      return JSON.parse(jsonData);
    } catch(error) {
      throw error
    }
  },

  findByIdAsync: async (email: string): Promise<User | null> => {
    return users.find((user) => user.email === email) || null;
  },
};
