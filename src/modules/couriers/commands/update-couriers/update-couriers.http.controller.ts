import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UpdateCouriersCommand } from './update-couriers.command'
import { UpdateCouriersParamRequestDto, UpdateCouriersRequestDto } from './update-couriers.request.dto'

@Controller('couriers')
export class UpdateCouriersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':couriersId')
  @UseGuards(AuthGuard)
  async patch(@Param() param: UpdateCouriersParamRequestDto, @Body() request: UpdateCouriersRequestDto): Promise<void> {
    const command: UpdateCouriersCommand = new UpdateCouriersCommand({
      courierId: param.couriersId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
