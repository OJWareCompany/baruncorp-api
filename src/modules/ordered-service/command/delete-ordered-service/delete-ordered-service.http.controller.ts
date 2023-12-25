import { CommandBus } from '@nestjs/cqrs'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteOrderedServiceCommand } from './delete-ordered-service.command'
import { DeleteOrderedServiceRequestDto } from './delete-ordered-service.request.dto'

@Controller('ordered-services')
export class DeleteOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':orderedServiceId')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Param() request: DeleteOrderedServiceRequestDto): Promise<void> {
    const command = new DeleteOrderedServiceCommand(request)
    await this.commandBus.execute(command)
  }
}
