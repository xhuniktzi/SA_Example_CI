import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
  roles: string[];
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { userId: 1, username: 'john',  password: 'changeme', roles: ['user'] },
    { userId: 2, username: 'maria', password: 'guess',    roles: ['admin'] },
  ];

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find(u => u.userId === userId);
  }
}
