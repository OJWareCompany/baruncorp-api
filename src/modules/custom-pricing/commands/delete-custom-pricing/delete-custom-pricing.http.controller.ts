import { CommandBus } from '@nestjs/cqrs'
import { Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteCustomPricingCommand } from './delete-custom-pricing.command'
import { DeleteCustomPricingParamRequestDto } from './delete-custom-pricing.request.dto'

@Controller('custom-pricings')
export class DeleteCustomPricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':organizationId/:serviceId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeleteCustomPricingParamRequestDto): Promise<void> {
    const command = new DeleteCustomPricingCommand({
      ...param,
    })
    await this.commandBus.execute(command)
  }
}
