/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceLineItemResponse } from '../../dtos/vendor-invoice-line-item.response.dto'
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'

export class FindVendorToInvoiceLineItemsQuery extends PaginatedQueryBase {
  readonly clientOrganizationId: string
  readonly serviceMonth: Date
  constructor(props: PaginatedParams<FindVendorToInvoiceLineItemsQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorToInvoiceLineItemsQuery)
export class FindVendorToInvoiceLineItemsQueryHandler implements IQueryHandler {
  constructor(
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly assignedTaskMapper: AssignedTaskMapper,
  ) {}

  async execute(query: FindVendorToInvoiceLineItemsQuery): Promise<Paginated<VendorInvoiceLineItemResponse>> {
    const result = await this.assignedTaskRepo.findToVendorInvoice(
      query.clientOrganizationId,
      query.serviceMonth,
      query,
    )
    const totalCount = await this.prismaService.assignedTasks.count({
      where: {
        organizationId: query.clientOrganizationId,
        status: AssignedTaskStatusEnum.Completed,
        isVendor: true,
        NOT: { cost: null },
        // TODO: 검토필요, createdAt으로 교체?
        startedAt: {
          gte: zonedTimeToUtc(startOfMonth(query.serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(query.serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
      },
    })

    return new Paginated<VendorInvoiceLineItemResponse>({
      items: result.map(this.assignedTaskMapper.toResponseForVendorLineItem),
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
