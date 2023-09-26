import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindTaskQuery {
  readonly taskId: string
  constructor(props: FindTaskQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindTaskQuery)
export class FindTaskQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindTaskQuery): Promise<Tasks> {
    const result = await this.prismaService.tasks.findUnique({ where: { id: query.taskId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
