import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Delete } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { DeleteCouriersCommand } from './delete-couriers.command'
import { DeleteCouriersParamRequestDto } from './delete-couriers.request.dto'

@Controller('couriers')
export class DeleteCouriersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':couriersId')
  @UseGuards(AuthGuard)
  async patch(@Param() param: DeleteCouriersParamRequestDto): Promise<void> {
    const command: DeleteCouriersCommand = new DeleteCouriersCommand({
      couriersId: param.couriersId,
    })
    await this.commandBus.execute(command)
  }
}
