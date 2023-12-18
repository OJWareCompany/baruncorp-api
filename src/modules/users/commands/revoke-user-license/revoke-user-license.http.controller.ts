import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { RevokeUserLicenseCommand } from './revoke-user-license.command'
import { RevokeUserLicenseRequestDto, RevokeUserLicenseRequestParamDto } from './revoke-user-license.request.dto'

@Controller('licenses')
export class RevokeUserLicenseHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':stateName/users/:userId')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: RevokeUserLicenseRequestDto,
    @Param() param: RevokeUserLicenseRequestParamDto,
  ): Promise<IdResponse> {
    const command = new RevokeUserLicenseCommand({
      type: request.type,
      stateName: param.stateName,
      userId: param.userId,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
