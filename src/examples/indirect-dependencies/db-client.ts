/**
 * Database client that uses the Database class
 */
import Database, { DatabaseConfig } from './database';

export class DbClient {
  private db: Database;
  
  constructor(config: DatabaseConfig) {
    this.db = new Database(config);
  }
  
  async initialize(): Promise<void> {
    await this.db.connect();
  }
  
  async findUsers(searchTerm: string): Promise<any[]> {
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    return this.db.query(query, [`%${searchTerm}%`]);
  }
  
  async close(): Promise<void> {
    await this.db.disconnect();
  }
}

export default DbClient;
