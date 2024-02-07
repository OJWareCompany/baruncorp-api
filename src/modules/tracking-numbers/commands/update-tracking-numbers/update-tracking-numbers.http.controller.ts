import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UpdateTrackingNumbersCommand } from './update-tracking-numbers.command'
import {
  UpdateTrackingNumbersParamRequestDto,
  UpdateTrackingNumbersRequestDto,
} from './update-tracking-numbers.request.dto'

@Controller('tracking-numbers')
export class UpdateTrackingNumbersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':trackingNumberId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdateTrackingNumbersParamRequestDto,
    @Body() request: UpdateTrackingNumbersRequestDto,
  ): Promise<void> {
    const command: UpdateTrackingNumbersCommand = new UpdateTrackingNumbersCommand({
      trackingNumberId: param.trackingNumberId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
