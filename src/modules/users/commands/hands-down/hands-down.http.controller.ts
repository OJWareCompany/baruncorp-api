import { Controller, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { CommandBus } from '@nestjs/cqrs'
import { HandsDownCommand } from './hands-down.command'

@Controller('users')
export class HandsDownHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('hands/down')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity) {
    const command = new HandsDownCommand({ userId: user.id })
    await this.commandBus.execute(command)
  }
}
