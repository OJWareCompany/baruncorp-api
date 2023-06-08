import { Injectable } from '@nestjs/common'

// This should be a real class/interface representing a user entity
export type User = any

@Injectable()
export class UsersService {
  // TODO: Setup Prisma
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      email: 'john@gmail.com',
      password: '$2b$10$RVet/L9xDhUHOfOWo3yeEO6WF7WbL7aJdFcJjcvaQ7Dt5hb3V5p/.',
    },
    {
      userId: 2,
      email: 'maria@gmail.com',
      username: 'maria',
      password: '$2b$10$RVet/L9xDhUHOfOWo3yeEO6WF7WbL7aJdFcJjcvaQ7Dt5hb3V5p/.',
    },
  ]

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }
}
