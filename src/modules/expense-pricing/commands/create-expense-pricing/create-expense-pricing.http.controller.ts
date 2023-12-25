import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateExpensePricingCommand, ExpenseTypeEnum } from './create-expense-pricing.command'
import { CreateExpensePricingRequestDto } from './create-expense-pricing.request.dto'

@Controller('expense-pricings')
export class CreateExpensePricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateExpensePricingRequestDto): Promise<IdResponse> {
    const command = new CreateExpensePricingCommand({
      ...request,
      resiNewExpenseType: request.resiNewExpenseType as ExpenseTypeEnum,
      resiRevExpenseType: request.resiRevExpenseType as ExpenseTypeEnum,
      comNewExpenseType: request.comNewExpenseType as ExpenseTypeEnum,
      comRevExpenseType: request.comRevExpenseType as ExpenseTypeEnum,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
