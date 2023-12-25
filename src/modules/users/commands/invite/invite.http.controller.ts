import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { InviteCommand } from './invite.command'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { InviteRequestDto } from './invite.request.dto'

@Controller('invitations')
export class InviteHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(AuthGuard)
  @Post('')
  async post(@User() user: UserEntity, @Body() request: InviteRequestDto) {
    const command = new InviteCommand({
      organizationId: request.organizationId,
      email: request.email,
    })
    await this.commandBus.execute(command)
  }
}
