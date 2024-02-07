import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Delete } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { DeleteTrackingNumbersCommand } from './delete-tracking-numbers.command'
import { DeleteTrackingNumbersParamRequestDto } from './delete-tracking-numbers.request.dto'

@Controller('tracking-numbers')
export class DeleteTrackingNumbersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':trackingNumbersId')
  @UseGuards(AuthGuard)
  async patch(@Param() param: DeleteTrackingNumbersParamRequestDto): Promise<void> {
    const command: DeleteTrackingNumbersCommand = new DeleteTrackingNumbersCommand({
      trackingNumbersId: param.trackingNumbersId,
    })
    await this.commandBus.execute(command)
  }
}
