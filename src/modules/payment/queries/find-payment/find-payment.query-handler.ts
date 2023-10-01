import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindPaymentQuery {
  readonly paymentId: string
  constructor(props: FindPaymentQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPaymentQuery)
export class FindPaymentQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPaymentQuery): Promise<Payments> {
    const result = await this.prismaService.payments.findUnique({ where: { id: query.paymentId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
