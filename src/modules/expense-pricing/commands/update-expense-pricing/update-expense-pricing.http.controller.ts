import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateExpensePricingCommand } from './update-expense-pricing.command'
import {
  UpdateExpensePricingRequestDto,
  UpdateExpensePricingParamRequestDto,
} from './update-expense-pricing.request.dto'
import { ExpenseTypeEnum } from '../create-expense-pricing/create-expense-pricing.command'

@Controller('expense-pricings')
export class UpdateExpensePricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':organizationId/:taskId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateExpensePricingParamRequestDto,
    @Body() request: UpdateExpensePricingRequestDto,
  ): Promise<void> {
    const command = new UpdateExpensePricingCommand({
      ...param,
      ...request,
      resiNewExpenseType: request.resiNewExpenseType as ExpenseTypeEnum,
      resiRevExpenseType: request.resiRevExpenseType as ExpenseTypeEnum,
      comNewExpenseType: request.comNewExpenseType as ExpenseTypeEnum,
      comRevExpenseType: request.comRevExpenseType as ExpenseTypeEnum,
    })
    await this.commandBus.execute(command)
  }
}
