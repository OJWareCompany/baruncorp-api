import { Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { UserRepositoryPort } from './user.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import UserMapper from '../user.mapper'
import { UserEntity } from '../domain/user.entity'
import { UserName } from '../domain/value-objects/user-name.vo'
import { UserRoleMapper } from '../user-role.mapper'
import { UserRole } from '../domain/value-objects/user-role.vo'
import { LicenseModel } from '../../department/database/department.repository'
import { LicenseEntity, LicenseType } from '../user-license.entity'
import { LicenseMapper } from '../../department/license.mapper'

export type UserModel = Users
@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly userRoleMapper: UserRoleMapper,
    private readonly licenseMapper: LicenseMapper,
  ) {}
  async findAll(): Promise<UserEntity[]> {
    const records = await this.prismaService.users.findMany()
    return records && records.map(this.userMapper.toDomain)
  }

  async findByOrganizationId(organizationId: string): Promise<UserEntity[]> {
    const records = await this.prismaService.users.findMany({ where: { organizationId } })
    return records && records.map(this.userMapper.toDomain)
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.prismaService.users.findUnique({ where: { id } })
    return user && this.userMapper.toDomain(user)
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
    return user && this.userMapper.toDomain(user)
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

  async findRoleByUserId(userId: string): Promise<UserRole> {
    const record = await this.prismaService.userRole.findFirst({ where: { userId } })
    return record && this.userRoleMapper.toDomain(record)
  }

  async giveRole(prop: UserRole): Promise<void> {
    const record = this.userRoleMapper.toPersistence(prop)
    await this.prismaService.userRole.create({ data: record })
  }

  // TODO: how to soft delete
  async removeRole(entity: UserRole): Promise<void> {
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

  async findAllLicenses(): Promise<LicenseEntity[]> {
    const electricalLicenses = await this.prismaService.userElectricalLicenses.findMany({
      include: {
        userEntity: true,
      },
    })
    const structuralLicenses = await this.prismaService.userStructuralLicenses.findMany({
      include: {
        userEntity: true,
      },
    })

    return [
      ...electricalLicenses.map((license) =>
        this.licenseMapper.toDomain(
          { record: license, type: LicenseType.Electrical },
          this.userMapper.toDomain(license.userEntity),
        ),
      ),

      ...structuralLicenses.map((license) =>
        this.licenseMapper.toDomain(
          { record: license, type: LicenseType.Structural },
          this.userMapper.toDomain(license.userEntity),
        ),
      ),
    ]
  }

  // this should be in user repository?, 여기에 있으면 유저 모듈에 department repository가 종속성으로 주입된다.
  // userEntity가 아니라 userId면 더 좋은점이 있나
  async findLicensesByUser(user: UserEntity): Promise<LicenseEntity[]> {
    const electricalLicenses: LicenseModel[] = await this.prismaService.userElectricalLicenses.findMany({
      where: { userId: user.getProps().id },
    })
    const structuralLicenses: LicenseModel[] = await this.prismaService.userStructuralLicenses.findMany({
      where: { userId: user.getProps().id },
    })

    return [
      ...electricalLicenses.map((license) =>
        this.licenseMapper.toDomain({ record: license, type: LicenseType.Electrical }, user),
      ),

      ...structuralLicenses.map((license) =>
        this.licenseMapper.toDomain({ record: license, type: LicenseType.Structural }, user),
      ),
    ]
  }

  async registerLicense(entity: LicenseEntity): Promise<void> {
    const record = this.licenseMapper.toPersistence(entity)
    if (entity.getProps().type === 'Electrical') {
      await this.prismaService.userElectricalLicenses.create({
        data: { ...record },
      })
    } else if (entity.getProps().type === 'Structural') {
      await this.prismaService.userStructuralLicenses.create({
        data: { ...record },
      })
    }
  }

  async revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<void> {
    if (type === 'Electrical') {
      await this.prismaService.userElectricalLicenses.delete({
        where: { userId_issuingCountryName: { userId, issuingCountryName } },
      })
    } else if (type === 'Structural') {
      await this.prismaService.userStructuralLicenses.delete({
        where: { userId_issuingCountryName: { userId, issuingCountryName } },
      })
    }
  }
}
