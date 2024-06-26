import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Tasks, Users } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { UserRoleNameEnum } from '../../../users/domain/value-objects/user-role.vo'

export class FindUnregisteredUsersForTaskPaginatedQuery extends PaginatedQueryBase {
  readonly taskId: string
  constructor(props: PaginatedParams<FindUnregisteredUsersForTaskPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindUnregisteredUsersForTaskPaginatedQuery)
export class FindUnregisteredUsersForTaskPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUnregisteredUsersForTaskPaginatedQuery): Promise<Paginated<Users>> {
    const userTasks = await this.prismaService.userAvailableTasks.findMany({ where: { taskId: query.taskId } })
    const users = await this.prismaService.users.findMany({
      skip: query.offset,
      take: query.limit,
      where: {
        id: { notIn: userTasks.map((task) => task.userId) },
        OR: [
          { type: { in: [UserRoleNameEnum.admin, UserRoleNameEnum.member, UserRoleNameEnum.special_admin] } },
          { isVendor: true },
        ],
      },
    })

    const totalCount = await this.prismaService.users.count({
      where: {
        id: { notIn: userTasks.map((task) => task.userId) },
        OR: [
          { type: { in: [UserRoleNameEnum.admin, UserRoleNameEnum.member, UserRoleNameEnum.special_admin] } },
          { isVendor: true },
        ],
      },
    })

    return new Paginated<Users>({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: users,
    })
  }
}
