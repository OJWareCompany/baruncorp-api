import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import {
  Organizations,
  Positions,
  Users,
  UserRole,
  UserPosition,
  Roles,
  UserLicense,
  UserAvailableTasks,
  Tasks,
  Ptos,
  PtoDetails,
} from '@prisma/client'
import { UserRepositoryPort } from './user.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { EmailVO } from '../domain/value-objects/email.vo'
import { UserRole as RolesVO } from '../domain/value-objects/user-role.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import UserMapper from '../user.mapper'
import { UserEntity } from '../domain/user.entity'
import { UserRoleMapper } from '../user-role.mapper'
import { UserNotFoundException } from '../user.error'

export type UserModel = Users
export type UserQueryModel = Users & {
  organization: Organizations
  userRole: (UserRole & { role: Roles }) | null
  userPosition: (UserPosition & { position: Positions }) | null
  licenses: UserLicense[]
  availableTasks: (UserAvailableTasks & { task: Tasks | null })[]
  ptos?: Ptos[]
  ptoDetails?: PtoDetails[]
}

@Injectable()
export class UserRepository implements UserRepositoryPort {
  static userQueryIncludeInput = {
    organization: true,
    userRole: { include: { role: true } },
    userPosition: { include: { position: true } },
    licenses: true,
    availableTasks: { include: { task: true } },
    ptos: true,
    ptoDetails: true,
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly userRoleMapper: UserRoleMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: string): Promise<UserEntity | null> {
    try {
      const user: UserQueryModel | null = await this.prismaService.users.findUnique({
        where: { id },
        include: UserRepository.userQueryIncludeInput,
      })
      return user ? this.userMapper.toDomain(user) : null
    } catch (error) {
      return null
    }
  }

  async findOneByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id)
    if (!user) throw new UserNotFoundException()
    return user
  }

  /**
   * Entity의 모든 필드가 DB에 업데이트 되어야한다.
   */
  async update(entity: UserEntity): Promise<void> {
    const record = this.userMapper.toPersistence(entity)

    await this.prismaService.users.update({
      where: { id: record.id },
      data: { ...record },
    })

    await this.prismaService.userRole.update({
      where: { userId: record.id },
      data: { roleName: record.type },
    })

    await entity.publishEvents(this.eventEmitter)
  }

  // TODO: Check a transaction
  async insertUserPassword(entity: UserEntity, password: InputPasswordVO): Promise<void> {
    await this.prismaService.passwords.create({
      data: { password: await password.hash(), userId: entity.id },
    })
  }

  async findUserByEmailOrThrow({ email }: EmailVO): Promise<UserEntity> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      include: UserRepository.userQueryIncludeInput,
    })
    if (!user) throw new UserNotFoundException()
    return this.userMapper.toDomain(user)
  }

  // TODO: transfer Prisma Class to Entity Class
  async findPasswordByUserId(id: string): Promise<string | null> {
    const password = await this.prismaService.passwords.findFirst({
      select: { password: true },
      where: { userId: id },
    })
    return password?.password || null
  }

  async giveRole(prop: RolesVO): Promise<void> {
    const user = await this.prismaService.users.findUnique({ where: { id: prop.userId } })
    if (!user) throw new UserNotFoundException()

    const record = this.userRoleMapper.toPersistence(prop)
    await this.prismaService.userRole.create({ data: record })
  }

  // TODO: how to soft delete
  async removeRole(entity: RolesVO): Promise<void> {
    const user = await this.prismaService.users.findUnique({ where: { id: entity.userId } })
    if (!user) throw new UserNotFoundException()

    await this.prismaService.userRole.delete({
      where: {
        userId_roleName: {
          userId: entity.userId,
          roleName: entity.name,
        },
      },
    })
  }

  async transaction(...args: any[]): Promise<any> {
    return await this.prismaService.$transaction([...args])
  }
}
