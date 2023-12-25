import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/authentication.guard'
import { CommandBus } from '@nestjs/cqrs'
import { CheckOutAssigningTaskAlertCommand } from './check-out-assigning-task-alert.command'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CheckOutAssigningTaskAlertRequestParamDto } from './check-out-assigning-task-alert.request.dto'

@Controller('assigning-task-alerts')
export class CheckOutAssigningTaskAlertHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(AuthGuard)
  @Patch(':assigningTaskAlertId/check-out')
  async checkOut(@User() user: UserEntity, @Param() request: CheckOutAssigningTaskAlertRequestParamDto) {
    const command = new CheckOutAssigningTaskAlertCommand({ assigningTaskAlertId: request.assigningTaskAlertId })
    await this.commandBus.execute(command)
  }
}
