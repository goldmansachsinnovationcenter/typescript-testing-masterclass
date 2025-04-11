/**
 * User repository that uses the DbClient
 */
import DbClient from './db-client';

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserRepository {
  private dbClient: DbClient;
  
  constructor(dbClient: DbClient) {
    this.dbClient = dbClient;
  }
  
  async findUsersByName(name: string): Promise<User[]> {
    await this.dbClient.initialize();
    const users = await this.dbClient.findUsers(name);
    return users as User[];
  }
}

export default UserRepository;
