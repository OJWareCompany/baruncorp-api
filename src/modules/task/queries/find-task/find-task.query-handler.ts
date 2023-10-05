import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { TaskNotFoundException } from '../../domain/task.error'

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
    if (!result) throw new TaskNotFoundException()
    return result
  }
}
