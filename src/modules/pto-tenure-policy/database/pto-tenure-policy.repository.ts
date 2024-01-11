import { Injectable } from '@nestjs/common'
import { PtoTenurePolicies } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PtoTenurePolicyMapper } from '../pto-tenure-policy.mapper'
import { PtoTenurePolicyEntity } from '../domain/pto-tenure-policy.entity'
import { PtoTenurePolicyRepositoryPort } from './pto-tenure-policy.repository.port'

export type PtoTenurePoliciesModel = PtoTenurePolicies
export type PtoTenurePoliciesQueryModel = PtoTenurePolicies
@Injectable()
export class PtoTenurePolicyRepository implements PtoTenurePolicyRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: PtoTenurePolicyMapper) {}

  async insert(entity: PtoTenurePolicyEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.ptoTenurePolicies.create({ data: record })
  }

  async update(entity: PtoTenurePolicyEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.ptoTenurePolicies.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<PtoTenurePolicies>`DELETE FROM pto_tenure_policies WHERE id = ${id}`
  }

  async findOne(id: string): Promise<PtoTenurePolicyEntity | null> {
    const record: PtoTenurePoliciesQueryModel | null = await this.prismaService.ptoTenurePolicies.findUnique({
      where: { id },
    })
    return record ? this.mapper.toDomain(record) : null
  }

  async findMany(offset: number, limit: number): Promise<PtoTenurePolicyEntity[]> {
    const records: PtoTenurePoliciesQueryModel[] = await this.prismaService.ptoTenurePolicies.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        tenure: 'desc',
      },
    })

    return records.map((record) => {
      return this.mapper.toDomain(record)
    })
  }

  async getCount(): Promise<number> {
    return await this.prismaService.ptoTenurePolicies.count()
  }

  async getMaxTotal(): Promise<number> {
    const result = await this.prismaService.ptoTenurePolicies.aggregate({
      _max: {
        total: true,
      },
    })
    // 만에 하나 DB에 아무런 값이 없다면 10 반환
    return result._max.total ?? 10
  }

  async getTotalOfTenure(tenure: number): Promise<number> {
    const result = await this.prismaService.ptoTenurePolicies.findFirst({
      where: {
        tenure: tenure,
      },
      select: {
        total: true,
      },
    })
    // 찾는 값이 없다면 기본 10으로 할당
    return result?.total ?? 10
  }
}
