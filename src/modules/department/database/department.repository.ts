import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Departments, Positions, UserStructuralLicenses } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { DepartmentRepositoryPort } from './department.repository.port'
import { PositionMapper } from '../position.mapper'
import { DepartmentEntity } from '../domain/department.entity'
import { PositionEntity } from '../domain/position.entity'
import { State } from '../domain/value-objects/state.vo'

export type DepartmentModel = Departments
export type PositionModel = Positions
export type LicenseModel = UserStructuralLicenses

@Injectable()
export class DepartmentRepository implements DepartmentRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly positionMapper: PositionMapper) {}

  async putMemberInChargeOfService(userId: string, serviceId: string): Promise<void> {
    const record = await this.prismaService.userService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
      include: {
        service: true,
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
        service: true,
      },
    })

    if (!record) throw new NotFoundException('has no that service.', '10021')

    await this.prismaService.userService.delete({ where: { userId_serviceId: { userId, serviceId } } })
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

  async findPositionByUserId(userId: string): Promise<PositionEntity | null> {
    const userPositionEntity = await this.prismaService.userPosition.findFirst({ where: { userId } })
    if (!userPositionEntity) return null
    const record = await this.prismaService.positions.findFirst({
      where: { id: userPositionEntity.positionId },
      include: { departmentEntity: true },
    })
    if (!record) return null
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

  async findAllStates(): Promise<State[]> {
    return await this.prismaService.states.findMany()
  }
}
