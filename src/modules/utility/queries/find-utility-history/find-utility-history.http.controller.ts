import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { FindUtilityHistoryRequestDto } from './find-utility-history.request.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UtilityHistoryDetailResponseDto } from '@modules/utility/dtos/utility-history-detail.response.dto'
import { FindUtilityHistoryQuery } from '@modules/utility/queries/find-utility-history/find-utility-history.query-handler'

@Controller('utilities')
export class FindUtilityHistoryHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('histories/:utilityHistoryId')
  @UseGuards(AuthGuard)
  async get(@Param() param: FindUtilityHistoryRequestDto): Promise<UtilityHistoryDetailResponseDto> {
    const query: FindUtilityHistoryQuery = new FindUtilityHistoryQuery({
      utilitySnapshotId: param.utilityHistoryId,
    })
    const result: UtilityHistoryDetailResponseDto = await this.queryBus.execute(query)

    return result
  }
}
