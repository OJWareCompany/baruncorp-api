import { Injectable, NotFoundException } from '@nestjs/common'
import { PtoAvailableValues, PtoDetails, PtoTypes, Ptos } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PtoMapper } from '../pto.mapper'
import { PtoEntity } from '../domain/pto.entity'
import { PtoRepositoryPort } from './pto.repository.port'
import { Paginated } from '@src/libs/ddd/repository.port'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TargetUserNotFoundException, UniqueConstraintException } from '../domain/pto.error'
import { PtoTargetUser } from '../domain/value-objects/target.user.vo'

export type PtoModel = Ptos & {
  details: PtoDetailModel[]
}
export type PtoDetailModel = PtoDetails
export type PtoQueryModel = Ptos & {
  // details: PtoDetailModel[]
  details: (PtoDetailModel & { ptoType: PtoTypes })[]
}
@Injectable()
export class PtoRepository implements PtoRepositoryPort {
  private ptoQueryIncludeInput = {
    // PtoDetails: true,
    PtoDetails: {
      include: {
        ptoType: true,
      },
    },
  }

  constructor(private readonly prismaService: PrismaService, private readonly ptoMapper: PtoMapper) {}

  async insert(entity: PtoEntity): Promise<void> {
    const record = this.ptoMapper.toPersistence(entity)
    await this.prismaService.ptos.create({ data: record })
  }

  async update(entity: PtoEntity): Promise<void> {
    const record = this.ptoMapper.toPersistence(entity)
    await this.prismaService.ptos.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Ptos>`DELETE FROM ptos WHERE id = ${id}`
  }

  // async findOne(id: string): Promise<PtoEntity | null> {
  //   const record: PtoQueryModel | null = await this.prismaService.ptos.findUnique({
  //     where: { id },
  //     include: this.ptoQueryIncludeInput,
  //   })
  //   return record ? this.ptoMapper.toDomain(record) : null
  // }

  //: Promise<Paginated<PtoEntity>>
  // async findMany(offset: number, limit: number): Promise<PtoEntity[]> {
  //   const records: PtoQueryModel[] = await this.prismaService.ptos.findMany({
  //     skip: offset,
  //     take: limit,
  //     include: this.ptoQueryIncludeInput,
  //     orderBy: {
  //       tenure: 'desc',
  //     },
  //   })

  //   return records.map((record) => {
  //     return this.ptoMapper.toDomain(record)
  //   })
  // }

  // Todo. 추후 User Repo에서 관리
  async findTargetUser(userId: string): Promise<PtoTargetUser> {
    try {
      const record = await this.prismaService.users.findUniqueOrThrow({
        where: { id: userId },
      })

      return new PtoTargetUser({
        id: record.id,
        // 우선 유저의 입사기념일이 없는 경우 createdAt을 기준으로 계산한다.
        dateOfJoining: record.dateOfJoining ? record.dateOfJoining : record.createdAt,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TargetUserNotFoundException()
      }
      throw new Error('An unexpected error occurred')
    }
  }

  async findOne(id: string): Promise<PtoEntity | null> {
    const record = await this.prismaService.ptos.findUnique({
      where: { id },
      include: this.ptoQueryIncludeInput,
    })

    if (!record) return null

    // PtoDetails를 details로 매핑
    const ptoQueryModel: PtoQueryModel = {
      ...record,
      details: [],
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

  async findMany(offset: number, limit: number): Promise<PtoEntity[]> {
    const records = await this.prismaService.ptos.findMany({
      skip: offset,
      take: limit,
      include: this.ptoQueryIncludeInput,
      orderBy: {
        tenure: 'desc',
      },
    })

    return records.map((record) => {
      const ptoQueryModel: PtoQueryModel = {
        ...record,
        details: record.PtoDetails,
      }

      return this.ptoMapper.toDomain(ptoQueryModel)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.ptos.count()
  }
}
