import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../domain/user.entity'
import { CreateUserCommand } from './create-user.command'
import { CreateUserRequestDto } from './create-user.request.dto'

@Controller('users')
export class CreateUserHttpContoller {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async createClient(@User() user: UserEntity, @Body() request: CreateUserRequestDto): Promise<IdResponse> {
    const command = new CreateUserCommand({
      updatedBy: user.getProps().userName.getFullName(),
      ...request,
    })

    const result = await this.commandBus.execute(command)

    return new IdResponse(result.id)
  }
}
