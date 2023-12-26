import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { AppointUserLicenseCommand } from './appoint-user-license.command'
import { AppointUserLicenseRequestDto, AppointUserLicenseRequestParamDto } from './appoint-user-license.request.dto'

@Controller('licenses')
export class AppointUserLicenseHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':abbreviation')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: AppointUserLicenseRequestDto,
    @Param() param: AppointUserLicenseRequestParamDto,
  ): Promise<void> {
    const command = new AppointUserLicenseCommand({
      abbreviation: param.abbreviation,
      userId: request.userId,
      type: request.type,
      expiryDate: request.expiryDate,
    })

    await this.commandBus.execute(command)
  }
}
