import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateCustomPricingCommand } from './update-custom-pricing.command'
import { UpdateCustomPricingRequestDto, UpdateCustomPricingParamRequestDto } from './update-custom-pricing.request.dto'

@Controller('custom-pricings')
export class UpdateCustomPricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':customPricingId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateCustomPricingParamRequestDto,
    @Body() request: UpdateCustomPricingRequestDto,
  ): Promise<void> {
    const command = new UpdateCustomPricingCommand({
      customPricingId: param.customPricingId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
