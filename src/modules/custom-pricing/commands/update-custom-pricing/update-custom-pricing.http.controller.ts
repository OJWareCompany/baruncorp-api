import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, UseGuards, Put } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateCustomPricingCommand } from './update-custom-pricing.command'
import { UpdateCustomPricingRequestDto, UpdateCustomPricingParamRequestDto } from './update-custom-pricing.request.dto'

@Controller('custom-pricings')
export class UpdateCustomPricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Put(':customPricingId')
  @UseGuards(AuthGuard)
  async put(
    @User() user: UserEntity,
    @Param() param: UpdateCustomPricingParamRequestDto,
    @Body() request: UpdateCustomPricingRequestDto,
  ): Promise<void> {
    const command = new UpdateCustomPricingCommand({
      customPricingId: param.customPricingId,
      type: request.customPricingType,
      residentialNewServiceTiers: request.commercialNewServiceTiers,
      residentialRevisionPrice: request.residentialRevisionPrice,
      residentialRevisionGmPrice: request.residentialRevisionGmPrice,
      commercialNewServiceTiers: request.commercialNewServiceTiers,
      fixedPrice: request.fixedPrice,
    })
    await this.commandBus.execute(command)
  }
}
