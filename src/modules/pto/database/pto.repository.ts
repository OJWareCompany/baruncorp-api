import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, PtoAvailableValues, PtoDetails, PtoTypes, Ptos, Users } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PtoMapper } from '../pto.mapper'
import { PtoEntity } from '../domain/pto.entity'
import { PtoRepositoryPort } from './pto.repository.port'
import { Paginated } from '@src/libs/ddd/repository.port'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DateOfJoiningNotFoundException, TargetUserNotFoundException, UniqueTenureException } from '../domain/pto.error'
import { PtoTargetUser } from '../domain/value-objects/target.user.vo'
import { PtoDetailEntity } from '../domain/pto-detail.entity'

export type PtoModel = Ptos
export type PtoQueryModel = Ptos & {
  user: Users
  details: (PtoDetailModel & {
    ptoType: PtoTypes
  })[]
}

export type PtoDetailModel = PtoDetails
export type PtoDetailQueryModel = PtoDetails & {
  user: Users
  pto: Ptos
  ptoType: PtoTypes
}

export type PtoAnnualQueryModel = PtoDetails & {
  pto: Ptos & {
    user: Pick<Users, 'id' | 'firstName' | 'lastName'>
  }
  ptoType: PtoTypes
}

@Injectable()
export class PtoRepository implements PtoRepositoryPort {
  private ptoQueryIncludeInput = {
    //Todo. user의 필요 부분만 select
    user: true,
    PtoDetails: {
      include: {
        ptoType: true,
      },
    },
  }

  private ptoDetailQueryIncludeInput = {
    //Todo. user의 필요 부분만 select
    pto: true,
    user: true,
    ptoType: true,
  }

  constructor(private readonly prismaService: PrismaService, private readonly ptoMapper: PtoMapper) {}

  async insert(entity: PtoEntity): Promise<void> {
    try {
      const record = this.ptoMapper.toPersistence(entity)
      await this.prismaService.ptos.create({ data: record })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueTenureException()
      } else {
        throw e
      }
    }
  }

  async update(entity: PtoEntity): Promise<void> {
    const record = this.ptoMapper.toPersistence(entity)
    await this.prismaService.ptos.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Ptos>`DELETE FROM ptos WHERE id = ${id}`
  }

  async insertDetail(entity: PtoDetailEntity): Promise<void> {
    const record = this.ptoMapper.toDetailPersistence(entity)
    await this.prismaService.ptoDetails.create({ data: record })
  }

  async updateDetail(entity: PtoDetailEntity): Promise<void> {
    const record = this.ptoMapper.toDetailPersistence(entity)
    await this.prismaService.ptoDetails.update({ where: { id: entity.id }, data: record })
  }

  async deleteDetail(id: string): Promise<void> {
    await this.prismaService.ptoDetails.delete({
      where: { id: id },
    })
  }

  async findTargetUser(userId: string): Promise<PtoTargetUser> {
    try {
      const record = await this.prismaService.users.findUniqueOrThrow({
        where: { id: userId },
      })

      return new PtoTargetUser({
        id: record.id,
        dateOfJoining: record.dateOfJoining,
        firstName: record.firstName,
        lastName: record.lastName,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TargetUserNotFoundException()
      } else {
        throw error
      }
    }
  }

  async findOne(id: string): Promise<PtoEntity | null> {
    const record = await this.prismaService.ptos.findUnique({
      where: { id },
      include: this.ptoQueryIncludeInput,
    })

    if (!record) return null

    const ptoQueryModel: PtoQueryModel = {
      ...record,
      user: record.user,
      details: record.PtoDetails,
    }

    return this.ptoMapper.toDomain(ptoQueryModel)
  }

  async findPtoFromTenure(userId: string, startDateTenure: number, endDateTenure: number): Promise<PtoEntity[]> {
    const records = await this.prismaService.ptos.findMany({
      where: {
        userId: userId,
        OR: [{ tenure: startDateTenure }, { tenure: endDateTenure }],
      },
      include: this.ptoQueryIncludeInput,
    })

    return records.map((record) => {
      const ptoQueryModel: PtoQueryModel = {
        ...record,
        details: record.PtoDetails,
      }

      return this.ptoMapper.toDomain(ptoQueryModel)
    })
  }

  async findMany(condition: Prisma.PtosWhereInput, offset: number, limit: number): Promise<PtoEntity[]> {
    const records = await this.prismaService.ptos.findMany({
      where: condition,
      include: this.ptoQueryIncludeInput,
      orderBy: {
        startedAt: 'desc',
      },
      skip: offset,
      take: limit,
    })

    return records.map((record) => {
      const ptoQueryModel: PtoQueryModel = {
        ...record,
        details: record.PtoDetails,
      }

      return this.ptoMapper.toDomain(ptoQueryModel)
    })
  }

  async getCount(condition: Prisma.PtosWhereInput): Promise<number> {
    return await this.prismaService.ptos.count({ where: condition })
  }

  async getCountDetail(condition: Prisma.PtosWhereInput): Promise<number> {
    return await this.prismaService.ptos.count({ where: condition })
  }

  async findOnePtoDetail(id: string): Promise<PtoDetailEntity | null> {
    const record = await this.prismaService.ptoDetails.findUnique({
      where: { id },
      include: this.ptoDetailQueryIncludeInput,
    })

    if (!record) return null

    const ptoDetailQueryModel: PtoDetailQueryModel = {
      id: record.id,
      userId: record.userId,
      ptoId: record.ptoId,
      ptoTypeId: record.ptoTypeId,
      amount: record.amount,
      days: record.days,
      startedAt: record.startedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      pto: record.pto,
      ptoType: record.ptoType,
      user: record.user,
    }

    if (!record.user.dateOfJoining) {
      throw new DateOfJoiningNotFoundException()
    }

    return this.ptoMapper.toDetailDomain(ptoDetailQueryModel)
  }
}
