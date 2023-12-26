import { CommandBus } from '@nestjs/cqrs'
import { Controller, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { RevokeUserLicenseCommand } from './revoke-user-license.command'
import { RevokeUserLicenseRequestDto, RevokeUserLicenseRequestParamDto } from './revoke-user-license.request.dto'

@Controller('licenses')
export class RevokeUserLicenseHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':abbreviation/users/:userId')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Query() request: RevokeUserLicenseRequestDto,
    @Param() param: RevokeUserLicenseRequestParamDto,
  ): Promise<void> {
    const command = new RevokeUserLicenseCommand({
      type: request.type,
      abbreviation: param.abbreviation,
      userId: param.userId,
    })
    await this.commandBus.execute(command)
  }
}
