import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from './user.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { EmailVO } from '../vo/email.vo'
import { UserProp } from '../interfaces/user.interface'
import { InputPasswordVO } from '../vo/password.vo'

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  // maybe userentity no need 'id'
  async findOneById(id: string): Promise<UserProp> {
    return await this.prismaService.users.findUnique({
      where: { id },
      // select: {
      //   email: true,
      //   firstName: true,
      //   lastName: true,
      //   organization: true,
      // },
    })
  }

  async update(userId: string, { firstName, lastName }: Pick<UserProp, 'firstName' | 'lastName'>): Promise<UserProp> {
    return await this.prismaService.users.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
      },
    })
  }

  // TODO: Check a transaction
  async insertUser(organizationId: number, data: UserProp, password: InputPasswordVO): Promise<UserProp> {
    return await this.prismaService.users.create({
      data: {
        ...data,
        organizationId,
        passwordEntity: {
          create: {
            password: await password.hash(),
          },
        },
      },
    })
  }

  async findOneByEmail({ email }: EmailVO): Promise<UserProp> {
    return await this.prismaService.users.findUnique({
      where: {
        email,
      },
    })
  }

  async findUserIdByEmail({ email }: EmailVO): Promise<Pick<UserProp, 'id'>> {
    return await this.prismaService.users.findUnique({
      select: { id: true },
      where: {
        email,
      },
    })
  }

  // TODO: transfer Prisma Class to Entity Class
  // TODO: change Dependency number to user? (security?)
  async findPasswordByUserId(id: string): Promise<string> {
    const password = await this.prismaService.passwords.findFirst({
      select: { password: true },
      where: { userId: id },
    })
    return password.password
  }

  async transaction(...args: any[]): Promise<any> {
    return await this.prismaService.$transaction([...args])
  }
}
