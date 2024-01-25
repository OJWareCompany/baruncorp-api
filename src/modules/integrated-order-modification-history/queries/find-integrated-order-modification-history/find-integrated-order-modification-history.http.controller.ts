import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { IntegratedOrderModificationHistoryResponseDto } from '../../dtos/integrated-order-modification-history.response.dto'
import { FindIntegratedOrderModificationHistoryRequestDto } from './find-integrated-order-modification-history.request.dto'
import { FindIntegratedOrderModificationHistoryQuery } from './find-integrated-order-modification-history.query-handler'

@Controller('integrated-order-modification-history')
export class FindIntegratedOrderModificationHistoryHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':integratedOrderModificationHistoryId')
  async get(
    @Param() request: FindIntegratedOrderModificationHistoryRequestDto,
  ): Promise<IntegratedOrderModificationHistoryResponseDto> {
    const command = new FindIntegratedOrderModificationHistoryQuery(request)

    const result: IntegratedOrderModificationHistory = await this.queryBus.execute(command)

    return {} as any
    // return new IntegratedOrderModificationHistoryResponseDto() as any
  }
}
