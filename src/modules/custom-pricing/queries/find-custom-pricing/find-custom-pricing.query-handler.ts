import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CustomPricings } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindCustomPricingQuery {
  readonly customPricingId: string
  constructor(props: FindCustomPricingQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindCustomPricingQuery)
export class FindCustomPricingQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindCustomPricingQuery): Promise<CustomPricings> {
    const result = await this.prismaService.customPricings.findUnique({ where: { id: query.customPricingId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
