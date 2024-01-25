/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { ProjectNotFoundException } from '../../domain/project.error'
import { OrderedJobs, OrderedProjects, Organizations } from '@prisma/client'

export class FindProjectDetailQuery {
  readonly id: string

  constructor(props: FindProjectDetailQuery) {
    this.id = props?.id
  }
}

export type FindProjectDetailReturnType = OrderedProjects & { organization: Organizations | null } & {
  jobs: OrderedJobs[]
}
@QueryHandler(FindProjectDetailQuery)
export class FindProjectDetailQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */

  async execute(query: FindProjectDetailQuery): Promise<FindProjectDetailReturnType> {
    const record: FindProjectDetailReturnType | null = await this.prismaService.orderedProjects.findUnique({
      where: { id: query.id },
      include: {
        organization: true,
        jobs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    if (!record) throw new ProjectNotFoundException()
    return record
  }
}
