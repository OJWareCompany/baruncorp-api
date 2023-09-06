import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { CreateUserCommand } from './create-user.command'
import { CreateUserRequestDto } from './create-user.request.dto'

@Controller('users')
export class CreateUserHttpContoller {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('clients')
  @ApiResponse({ status: HttpStatus.CREATED })
  @UseGuards(AuthGuard)
  async createClient(@User() user: UserEntity, @Body() request: CreateUserRequestDto): Promise<{ userId: string }> {
    const command = new CreateUserCommand({
      type: 'client',
      updatedBy: user.getProps().userName.getFullName(),
      ...request,
    })

    return await this.commandBus.execute(command)
  }

  @Post('members')
  @ApiResponse({ status: HttpStatus.CREATED })
  @UseGuards(AuthGuard)
  async createMember(@User() user: UserEntity, @Body() request: CreateUserRequestDto): Promise<{ userId: string }> {
    const command = new CreateUserCommand({
      type: 'member',
      updatedBy: user.getProps().userName.getFullName(),
      ...request,
    })

    return await this.commandBus.execute(command)
  }
}
