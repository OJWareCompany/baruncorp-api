import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteCustomPricingCommand } from './delete-custom-pricing.command'
import { DeleteCustomPricingRequestDto, DeleteCustomPricingParamRequestDto } from './delete-custom-pricing.request.dto'

@Controller('custom-pricings')
export class DeleteCustomPricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':customPricingId')
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserEntity,
    @Param() param: DeleteCustomPricingParamRequestDto,
    @Body() request: DeleteCustomPricingRequestDto,
  ): Promise<void> {
    const command = new DeleteCustomPricingCommand({
      customPricingId: param.customPricingId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
