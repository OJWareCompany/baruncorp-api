import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Put } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { PutScheduleCommand } from './put-schedule.command'
import { PutScheduleRequestDto, PutScheduleParamRequestDto } from './put-schedule.request.dto'

@Controller('users')
export class PutScheduleHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Put(':userId/schedules')
  @UseGuards(AuthGuard)
  async put(@Param() param: PutScheduleParamRequestDto, @Body() request: PutScheduleRequestDto): Promise<void> {
    const command: PutScheduleCommand = new PutScheduleCommand({
      userId: param.userId,
      ...request,
    })

    await this.commandBus.execute(command)
  }
}
