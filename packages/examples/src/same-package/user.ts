/**
 * Example user module that uses the utils module from the same package
 */
import { generateId, validateEmail } from './utils';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class UserService {
  private users: User[] = [];
  
  createUser(name: string, email: string): User {
    if (!validateEmail(email)) {
      throw new Error('Invalid email address');
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  getAllUsers(): User[] {
    return [...this.users];
  }
}

export default UserService;
