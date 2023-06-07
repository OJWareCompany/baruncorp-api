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
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@gmail.com',
      username: 'maria',
      password: 'guess',
    },
  ]

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }
}
