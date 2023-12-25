import { Body, Controller, Param, Post } from '@nestjs/common'
import { SignUpRequestDto, SignUpRequestParamDto } from './sign-up.request.dto'
import { CommandBus } from '@nestjs/cqrs'
import { SignUpCommand } from './sign-up.command'

@Controller('sign-up')
export class SignUpHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':userId')
  async post(@Param() param: SignUpRequestParamDto, @Body() request: SignUpRequestDto) {
    const command = new SignUpCommand({
      userId: param.userId,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      deliverablesEmails: request.deliverablesEmails,
      password: request.password,
      phoneNumber: request.phoneNumber,
    })
    await this.commandBus.execute(command)
  }
}
