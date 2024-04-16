import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { ModifyPeriodMonthCommand } from './modify-period-month.command'
import { ModifyPeriodMonthRequestDto, ModifyPeriodMonthRequestParamDto } from './modify-period-month.request.dto'

@Controller('invoices')
export class ModifyPeriodMonthHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':invoiceId/service-period-month')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Param() param: ModifyPeriodMonthRequestParamDto,
    @Body() request: ModifyPeriodMonthRequestDto,
  ): Promise<IdResponse> {
    const command = new ModifyPeriodMonthCommand({
      invoiceId: param.invoiceId,
      serviceMonth: request.serviceMonth,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
