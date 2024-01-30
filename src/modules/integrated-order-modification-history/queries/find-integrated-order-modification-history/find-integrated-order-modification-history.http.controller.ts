import { IntegratedOrderModificationHistory } from '@prisma/client'
import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistoryResponseDto } from '../../dtos/integrated-order-modification-history.response.dto'
import { OrderModificationHistoryOperationEnum } from '../../domain/integrated-order-modification-history.type'
import { FindIntegratedOrderModificationHistoryRequestDto } from './find-integrated-order-modification-history.request.dto'
import { FindIntegratedOrderModificationHistoryQuery } from './find-integrated-order-modification-history.query-handler'

@Controller('integrated-order-modification-history')
export class FindIntegratedOrderModificationHistoryHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':jobId/:entityId/:attribute/:modifiedAt')
  async get(
    @Param() request: FindIntegratedOrderModificationHistoryRequestDto,
  ): Promise<IntegratedOrderModificationHistoryResponseDto> {
    const command = new FindIntegratedOrderModificationHistoryQuery(request)

    const result: IntegratedOrderModificationHistory = await this.queryBus.execute(command)

    return new IntegratedOrderModificationHistoryResponseDto({
      jobId: result.jobId,
      modifiedAt: result.modifiedAt,
      modifiedBy: result.modifiedBy,
      entity: result.entity,
      entityId: result.entityId,
      scopeOrTaskName: result.scopeOrTaskName,
      attribute: result.attribute,
      operation: result.operation as OrderModificationHistoryOperationEnum,
      afterValue: result.afterValue,
      beforeValue: result.beforeValue,
    })
  }
}
