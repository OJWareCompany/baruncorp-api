import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateOrderedScopeStatusCommand } from './update-ordered-scope-status.command'
import {
  UpdateOrderedScopeStatusParamRequestDto,
  UpdateOrderedScopeStatusRequestDto,
} from './update-ordered-scope-status.request.dto'

@Controller('ordered-services')
export class UpdateOrderedScopeStatusHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedScopeId/status')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateOrderedScopeStatusParamRequestDto,
    @Body() request: UpdateOrderedScopeStatusRequestDto,
  ): Promise<void> {
    const command = new UpdateOrderedScopeStatusCommand({
      orderedScopeId: param.orderedScopeId,
      status: request.status,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
