import { Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { CommandBus } from '@nestjs/cqrs'
import { HandsUpCommand } from './hands-up.command'

@Controller('users')
export class HandsUpHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('hands/up')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity) {
    const command = new HandsUpCommand({ userId: user.id })
    await this.commandBus.execute(command)
  }
}
