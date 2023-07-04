import { Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { UserRepositoryPort } from './user.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { EmailVO } from '../vo/email.vo'
import { InputPasswordVO } from '../vo/password.vo'
import UserMapper from '../user.mapper'
import { UserEntity } from '../entities/user.entity'
import { UserName } from '../vo/user-name.vo'
import { UserRoleMapper } from '../user-role.mapper'
import { UserRoleEntity } from '../entities/user-role.entity'

export type UserModel = Users
@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly userRoleMapper: UserRoleMapper,
  ) {}
  async findAll(): Promise<UserEntity[]> {
    const record = await this.prismaService.users.findMany()
    return record.map(this.userMapper.toDomain)
  }

  async findByOrganizationId(organizationId: string): Promise<UserEntity[]> {
    const records = await this.prismaService.users.findMany({ where: { organizationId } })
    return records.map(this.userMapper.toDomain)
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.prismaService.users.findUnique({ where: { id } })
    return this.userMapper.toDomain(user)
  }

  async update(userId: string, userName: UserName): Promise<void> {
    await this.prismaService.users.update({
      where: { id: userId },
      data: {
        firstName: userName.getFirstName(),
        lastName: userName.getLastName(),
      },
    })
  }

  // TODO: Check a transaction
  async insertUser(entity: UserEntity, password: InputPasswordVO): Promise<void> {
    const record = this.userMapper.toPersistence(entity)
    await this.prismaService.users.create({
      data: {
        ...record,
        passwordEntity: {
          create: {
            password: await password.hash(),
          },
        },
      },
    })
  }

  async findOneByEmail({ email }: EmailVO): Promise<UserEntity> {
    const user = await this.prismaService.users.findUnique({ where: { email } })
    return user ? this.userMapper.toDomain(user) : undefined
  }

  async findUserIdByEmail({ email }: EmailVO): Promise<Pick<UserEntity, 'id'>> {
    return await this.prismaService.users.findUnique({
      select: { id: true },
      where: { email },
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

  async findRoleByUserId(userId: string): Promise<UserRoleEntity> {
    const record = await this.prismaService.userRole.findFirst({ where: { userId } })
    return record ? this.userRoleMapper.toDomain(record) : null
  }

  async giveRole(prop: UserRoleEntity): Promise<void> {
    const record = this.userRoleMapper.toPersistence(prop)
    await this.prismaService.userRole.create({ data: record })
  }

  // TODO: how to soft delete
  async removeRole(entity: UserRoleEntity): Promise<void> {
    await this.prismaService.userRole.delete({
      where: {
        userId_role: {
          userId: entity.getProps().userId,
          role: entity.getProps().role,
        },
      },
    })
  }

  async transaction(...args: any[]): Promise<any> {
    return await this.prismaService.$transaction([...args])
  }
}
