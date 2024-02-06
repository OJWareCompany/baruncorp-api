import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Post, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateCouriersCommand } from './create-couriers.command'
import { CreateCouriersRequestDto } from './create-couriers.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { IdResponse } from '@libs/api/id.response.dto'
import { AggregateID } from '@libs/ddd/entity.base'

@Controller('couriers')
export class CreateCouriersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async post(@Body() dto: CreateCouriersRequestDto): Promise<IdResponse> {
    const command: CreateCouriersCommand = new CreateCouriersCommand(dto)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
