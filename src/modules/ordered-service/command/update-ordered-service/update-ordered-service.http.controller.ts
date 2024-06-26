import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateOrderedServiceCommand } from './update-ordered-service.command'
import {
  UpdateOrderedServiceParamRequestDto,
  UpdateOrderedServiceRequestDto,
} from './update-ordered-service.request.dto'

@Controller('ordered-services')
export class UpdateOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedServiceId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateOrderedServiceParamRequestDto,
    @Body() request: UpdateOrderedServiceRequestDto,
  ): Promise<void> {
    const command = new UpdateOrderedServiceCommand({
      orderedServiceId: param.orderedServiceId,
      description: request.description,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
