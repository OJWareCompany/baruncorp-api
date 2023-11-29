import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateManualPriceCommand } from './update-manual-price.command'
import { UpdateManualPriceParamRequestDto, UpdateManualPriceRequestDto } from './update-manual-price.request.dto'

@Controller('ordered-services')
export class UpdateManualPriceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedServiceId/manual-price')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateManualPriceParamRequestDto,
    @Body() request: UpdateManualPriceRequestDto,
  ): Promise<void> {
    const command = new UpdateManualPriceCommand({
      orderedServiceId: param.orderedServiceId,
      price: request.price,
    })
    await this.commandBus.execute(command)
  }
}
