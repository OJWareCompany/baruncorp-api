import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Ptos } from '@prisma/client'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { FindPtoRequestDto } from './find-pto.request.dto'
import { FindPtoQuery } from './find-pto.query-handler'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('ptos')
export class FindPtoHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':ptoId')
  @UseGuards(AuthGuard)
  async get(@Param() request: FindPtoRequestDto): Promise<PtoResponseDto> {
    const query = new FindPtoQuery(request)
    const result: PtoResponseDto = await this.queryBus.execute(query)
    return result
  }
}
