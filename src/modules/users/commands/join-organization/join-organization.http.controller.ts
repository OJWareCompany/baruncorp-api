import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AdminGuard } from '../../../auth/guards/authentication.admin.guard'
import { UserEntity } from '../../domain/user.entity'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { JoinOrganizationCommand } from './join-organization.command'
import { JoinOrganizationRequestDto, JoinOrganizationRequestParamDto } from './join-organization.request.dto'
import { UpdatePtoRangeCommand } from '../../../pto/commands/update-pto-range/update-pto-range.command'

@Controller('users')
export class JoinOrganizationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':userId/organizations/:organizationId/join')
  @UseGuards(AdminGuard)
  async post(
    @User() user: UserEntity,
    @Param() param: JoinOrganizationRequestParamDto,
    @Body() request: JoinOrganizationRequestDto,
  ): Promise<void> {
    const command = new JoinOrganizationCommand({
      organizationId: param.organizationId,
      joiningUserId: param.userId,
      dateOfJoining: request.dateOfJoining || null,
      editorUserId: user.id,
    })
    const result = await this.commandBus.execute(command)
  }
}
