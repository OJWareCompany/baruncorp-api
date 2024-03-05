import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateDepartmentRequestDto } from './create-department.request.dto'
import { CreateDepartmentCommand } from './create-department.command'

@Controller('departments')
export class CreateDepartmentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateDepartmentRequestDto): Promise<IdResponse> {
    const command = new CreateDepartmentCommand({
      ...request,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
