import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteExpensePricingCommand } from './delete-expense-pricing.command'
import {
  DeleteExpensePricingRequestDto,
  DeleteExpensePricingParamRequestDto,
} from './delete-expense-pricing.request.dto'

@Controller('expense-pricings')
export class DeleteExpensePricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':organizationId/:taskId')
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserEntity,
    @Param() param: DeleteExpensePricingParamRequestDto,
    // @Body() request: DeleteExpensePricingRequestDto,
  ): Promise<void> {
    const command = new DeleteExpensePricingCommand({
      ...param,
    })
    await this.commandBus.execute(command)
  }
}
