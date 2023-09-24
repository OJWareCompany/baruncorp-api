import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteOrderedServiceCommand } from './delete-ordered-service.command'
import { DeleteOrderedServiceRequestDto } from './delete-ordered-service.request.dto'

@Controller('delete-ordered-service')
export class DeleteOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() request: DeleteOrderedServiceRequestDto): Promise<IdResponse> {
    const command = new DeleteOrderedServiceCommand(request)
    const result = await this.commandBus.execute(command)
    return new IdResponse(result.id)
  }
}
