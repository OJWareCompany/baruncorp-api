import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { AppointUserLicenseCommand } from './appoint-user-license.command'
import { AppointUserLicenseRequestDto } from './appoint-user-license.request.dto'

@Controller('licenses')
export class AppointUserLicenseHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':stateName')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: AppointUserLicenseRequestDto): Promise<IdResponse> {
    const command = new AppointUserLicenseCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
