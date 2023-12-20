import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'

export class FindAvailableWorkersQuery {
  readonly assignedTaskId: string
  constructor(props: FindAvailableWorkersQuery) {
    this.assignedTaskId = props.assignedTaskId
  }
}

@QueryHandler(FindAvailableWorkersQuery)
export class FindAvailableWorkersQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  execute(query: FindAvailableWorkersQuery): Promise<any> {
    return Promise.resolve()
  }
}
