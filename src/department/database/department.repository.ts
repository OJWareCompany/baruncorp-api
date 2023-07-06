import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Departments, Positions, Services, UserStructuralLicenses } from '@prisma/client'
import { DepartmentEntity } from '../entities/department.entity'
import { LicenseEntity } from '../entities/license.entity'
import { PositionEntity } from '../entities/position.entity'
import { StateEntity } from '../entities/state.entity'
import { LicenseType } from '../interfaces/license.interface'
import { PrismaService } from '../../database/prisma.service'
import { LicenseMapper } from '../license.mapper'
import { DepartmentRepositoryPort } from './department.repository.port'
import { PositionMapper } from '../position.mapper'
import { UserEntity } from '../../users/entities/user.entity'
import UserMapper from '../../users/user.mapper'
import { ServiceEntity } from '../entities/service.entity'
import { ServiceMapper } from '../service.mapper'

export type DepartmentModel = Departments
export type PositionModel = Positions
export type LicenseModel = UserStructuralLicenses
export type ServiceModel = Services

@Injectable()
export class DepartmentRepository implements DepartmentRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly licenseMapper: LicenseMapper,
    private readonly positionMapper: PositionMapper,
    private readonly userMapper: UserMapper,
    private readonly serviceMapper: ServiceMapper,
  ) {}

  async findServicesByPositionId(positionId: string): Promise<ServiceEntity[]> {
    const records = await this.prismaService.positionService.findMany({
      where: {
        positionId,
      },
      include: {
        serviceEntity: true,
      },
    })

    const services = records.map((record) => record.serviceEntity)
    return services.map(this.serviceMapper.toDomain)
  }

  async putMemberInChargeOfService(userId: string, serviceId: string): Promise<void> {
    const record = await this.prismaService.userService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
      include: {
        serviceEntity: true,
      },
    })

    if (record) throw new ConflictException('already has service.', '10020')

    await this.prismaService.userService.create({ data: { userId, serviceId } })
  }

  async terminateServiceMemberIsInChargeOf(userId: string, serviceId: string): Promise<void> {
    const record = await this.prismaService.userService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
      include: {
        serviceEntity: true,
      },
    })

    if (!record) throw new NotFoundException('has no that service.', '10021')

    await this.prismaService.userService.delete({ where: { userId_serviceId: { userId, serviceId } } })
  }

  async findServicesByUserId(userId: string): Promise<ServiceEntity[]> {
    const records = await this.prismaService.userService.findMany({
      where: {
        userId,
      },
      include: {
        serviceEntity: true,
      },
    })

    const services = records.map((record) => record.serviceEntity)
    return services.map(this.serviceMapper.toDomain)
  }

  async findAllServices(): Promise<ServiceEntity[]> {
    const records = await this.prismaService.services.findMany()
    return records.map(this.serviceMapper.toDomain)
  }

  async findAll(): Promise<DepartmentEntity[]> {
    return await this.prismaService.departments.findMany()
  }

  async findAllPositions(): Promise<PositionEntity[]> {
    const records = await this.prismaService.positions.findMany({
      include: {
        departmentEntity: true,
      },
    })
    return records.map((position) => {
      return this.positionMapper.toDomain(position, position.departmentEntity)
    })
  }

  async findPositionByUserId(userId: string): Promise<PositionEntity> {
    const userPositionEntity = await this.prismaService.userPosition.findFirst({ where: { userId } })
    const id = userPositionEntity?.positionId
    if (!id) return undefined
    const record = await this.prismaService.positions.findFirst({ where: { id }, include: { departmentEntity: true } })
    return this.positionMapper.toDomain(record, record.departmentEntity)
  }

  // this should be in user repository?
  // findPositionByUserId(userId: string): Promise<PositionEntity[]> {
  //   return await this.prismaService.positions
  // }

  // Use History instead of soft delete!
  async appointPosition(userId: string, positionId: string): Promise<void> {
    await this.prismaService.userPosition.create({ data: { userId, positionId } })
  }

  async revokePosition(userId: string, positionId: string): Promise<void> {
    await this.prismaService.userPosition.delete({ where: { userId_positionId: { userId, positionId } } })
  }

  async findAllStates(): Promise<StateEntity[]> {
    return await this.prismaService.states.findMany()
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
          { record: license, type: 'Electrical' },
          this.userMapper.toDomain(license.userEntity),
        ),
      ),

      ...structuralLicenses.map((license) =>
        this.licenseMapper.toDomain(
          { record: license, type: 'Structural' },
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
        this.licenseMapper.toDomain({ record: license, type: 'Electrical' }, user),
      ),

      ...structuralLicenses.map((license) =>
        this.licenseMapper.toDomain({ record: license, type: 'Structural' }, user),
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
