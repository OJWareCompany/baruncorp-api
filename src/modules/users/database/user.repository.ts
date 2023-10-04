import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import {
  Organizations,
  Positions,
  UserElectricalLicenses,
  UserStructuralLicenses,
  Users,
  UserRole,
  UserService,
  Service,
  States,
  UserPosition,
  Roles,
  Tasks,
} from '@prisma/client'
import { UserRepositoryPort } from './user.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { EmailVO } from '../domain/value-objects/email.vo'
import { UserRole as RolesVO } from '../domain/value-objects/user-role.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import UserMapper from '../user.mapper'
import { UserEntity } from '../domain/user.entity'
import { UserRoleMapper } from '../user-role.mapper'
import { LicenseEntity } from '../user-license.entity'
import { UserNotFoundException } from '../user.error'

export type UserModel = Users
export type UserQueryModel = Users & {
  organization: Organizations
  userRole: (UserRole & { role: Roles }) | null
  userPosition: (UserPosition & { position: Positions }) | null
  userServices: (UserService & { service: Service & { tasks: Tasks[] } })[]
  userElectricalLicenses: (UserElectricalLicenses & { state: States })[]
  userStructuralLicenses: (UserStructuralLicenses & { state: States })[]
}

@Injectable()
export class UserRepository implements UserRepositoryPort {
  static userQueryIncludeInput = {
    organization: true,
    userRole: { include: { role: true } },
    userPosition: { include: { position: true } },
    userServices: { include: { service: { include: { tasks: true } } } },
    userElectricalLicenses: { include: { state: true } },
    userStructuralLicenses: { include: { state: true } },
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly userRoleMapper: UserRoleMapper,
    // private readonly licenseMapper: LicenseMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}
  findAllLicenses(): Promise<LicenseEntity[]> {
    throw new Error('Method not implemented.')
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user: UserQueryModel | null = await this.prismaService.users.findUnique({
      where: { id },
      include: UserRepository.userQueryIncludeInput,
    })
    if (!user) throw new UserNotFoundException()
    return this.userMapper.toDomain(user)
  }

  async findOneByIdOrThrow(id: string): Promise<UserEntity> {
    const user: UserQueryModel | null = await this.prismaService.users.findUnique({
      where: { id },
      include: UserRepository.userQueryIncludeInput,
    })
    if (!user) throw new UserNotFoundException()
    return this.userMapper.toDomain(user)
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
      where: {
        userId_roleName: {
          userId: entity.id,
          roleName: entity.role,
        },
      },
      data: {
        userId: entity.id,
        roleName: entity.role,
      },
    })
    await entity.publishEvents(this.eventEmitter)
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
    await this.prismaService.userRole.create({
      data: {
        userId: entity.id,
        roleName: entity.role,
      },
    })
  }

  async findUserIdByEmail({ email }: EmailVO): Promise<Pick<UserEntity, 'id'> | null> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    })
    if (!user) throw new UserNotFoundException()
    return await this.prismaService.users.findUnique({
      select: { id: true },
      where: { email },
    })
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

  // async findAllLicenses(): Promise<LicenseEntity[]> {
  //   const electricalLicenses = await this.prismaService.userElectricalLicenses.findMany({
  //     include: {
  //       user: {
  //         include: UserRepository.userQueryIncludeInput,
  //       },
  //     },
  //   })
  //   const structuralLicenses = await this.prismaService.userStructuralLicenses.findMany({
  //     include: {
  //       user: {
  //         include: UserRepository.userQueryIncludeInput,
  //       },
  //     },
  //   })

  //   return [
  //     ...electricalLicenses.map((license) =>
  //       this.licenseMapper.toDomain(license, LicenseType.Electrical, this.userMapper.toDomain(license.user)),
  //     ),

  //     ...structuralLicenses.map((license) =>
  //       this.licenseMapper.toDomain(license, LicenseType.Structural, this.userMapper.toDomain(license.user)),
  //     ),
  //   ]
  // }

  // this should be in user repository?, 여기에 있으면 유저 모듈에 department repository가 종속성으로 주입된다.
  // userEntity가 아니라 userId면 더 좋은점이 있나
  // async findLicensesByUser(user: UserEntity): Promise<LicenseEntity[]> {
  //   const electricalLicenses: LicenseModel[] = await this.prismaService.userElectricalLicenses.findMany({
  //     where: { userId: user.getProps().id },
  //   })
  //   const structuralLicenses: LicenseModel[] = await this.prismaService.userStructuralLicenses.findMany({
  //     where: { userId: user.getProps().id },
  //   })

  //   return [
  //     ...electricalLicenses.map((license) => this.licenseMapper.toDomain(license, LicenseType.Electrical, user)),
  //     ...structuralLicenses.map((license) => this.licenseMapper.toDomain(license, LicenseType.Structural, user)),
  //   ]
  // }

  // async registerLicense(entity: LicenseEntity): Promise<void> {
  //   const record = this.licenseMapper.toPersistence(entity)
  //   if (entity.getProps().type === 'Electrical') {
  //     await this.prismaService.userElectricalLicenses.create({
  //       data: { ...record },
  //     })
  //   } else if (entity.getProps().type === 'Structural') {
  //     await this.prismaService.userStructuralLicenses.create({
  //       data: { ...record },
  //     })
  //   }
  // }

  // async revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<void> {
  //   if (type === 'Electrical') {
  //     await this.prismaService.userElectricalLicenses.create({
  //       data: {
  //         expiryDate: null,
  //         issuedDate: null,
  //         priority: null,
  //         updatedAt: new Date(),
  //         createdAt: new Date(),
  //         userId: '',
  //         abbreviation: '',
  //         issuingCountryName: '',
  //       },
  //     })
  //     await this.prismaService.userElectricalLicenses.delete({
  //       where: { userId_issuingCountryName: { userId, issuingCountryName } },
  //     })
  //   } else if (type === 'Structural') {
  //     await this.prismaService.userStructuralLicenses.delete({
  //       where: { userId_issuingCountryName: { userId, issuingCountryName } },
  //     })
  //   }
  // }
}
