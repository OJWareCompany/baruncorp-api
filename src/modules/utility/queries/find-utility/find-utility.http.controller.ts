import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { FindUtilityRequestDto } from './find-utility.request.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { FindUtilityQuery } from '@modules/utility/queries/find-utility/find-utility.query-handler'
import { UtilityResponseDto } from '@modules/utility/dtos/utility.response.dto'

@Controller('utilities')
export class FindUtilityHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':utilityId')
  @UseGuards(AuthGuard)
  async get(@Param() param: FindUtilityRequestDto): Promise<UtilityResponseDto> {
    const query: FindUtilityQuery = new FindUtilityQuery(param)
    const result: UtilityResponseDto = await this.queryBus.execute(query)

    return result
  }
}
