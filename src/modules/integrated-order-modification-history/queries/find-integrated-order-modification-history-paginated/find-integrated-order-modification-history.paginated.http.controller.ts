import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { IntegratedOrderModificationHistoryPaginatedResponseDto } from '../../dtos/integrated-order-modification-history.paginated.response.dto'
import { FindIntegratedOrderModificationHistoryPaginatedQuery } from './find-integrated-order-modification-history.paginated.query-handler'
import { IntegratedOrderModificationHistoryResponseDto } from '../../dtos/integrated-order-modification-history.response.dto'
import { OrderModificationHistoryOperationEnum } from '../../domain/integrated-order-modification-history.type'
import { FindIntegratedOrderModificationHistoryPaginatedRequestDto } from './find-integrated-order-modification-history.paginated.request.dto'

@Controller('integrated-order-modification-history')
export class FindIntegratedOrderModificationHistoryPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindIntegratedOrderModificationHistoryPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<IntegratedOrderModificationHistoryPaginatedResponseDto> {
    const command = new FindIntegratedOrderModificationHistoryPaginatedQuery({
      ...queryParams,
      jobId: request.jobId,
    })

    const result: Paginated<IntegratedOrderModificationHistory> = await this.queryBus.execute(command)

    return new IntegratedOrderModificationHistoryPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map(
        (item) =>
          new IntegratedOrderModificationHistoryResponseDto({
            jobId: item.jobId,
            modifiedAt: item.modifiedAt,
            modifiedBy: item.modifiedBy,
            entity: item.entity,
            entityId: item.entityId,
            scopeOrTaskName: item.scopeOrTaskName,
            attribute: item.attribute,
            isDateType: item.isDateType,
            operation: item.operation as OrderModificationHistoryOperationEnum,
            afterValue: item.afterValue,
            beforeValue: item.beforeValue,
          }),
      ),
    })
  }
}
