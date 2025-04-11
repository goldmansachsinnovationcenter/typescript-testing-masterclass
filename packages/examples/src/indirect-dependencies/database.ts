/**
 * Example database module that will be indirectly mocked
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export class Database {
  private config: DatabaseConfig;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    console.log(`Connecting to database at ${this.config.host}:${this.config.port}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    this.isConnected = true;
    console.log('Database connected successfully');
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    
    console.log(`Executing query: ${sql}`);
    console.log(`With params: ${JSON.stringify(params)}`);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return [] as T[];
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    console.log('Disconnecting from database');
    await new Promise(resolve => setTimeout(resolve, 50));
    this.isConnected = false;
    console.log('Database disconnected successfully');
  }
}

export default Database;
