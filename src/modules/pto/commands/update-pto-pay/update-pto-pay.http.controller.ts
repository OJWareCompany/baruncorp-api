import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePtoPayCommand } from './update-pto-pay.command'
import { UpdatePtoPayRequestDto, UpdatePtoPayParamRequestDto } from './update-pto-pay.request.dto'

@Controller('ptos')
export class UpdatePtoPayHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':ptoId/pay')
  @UseGuards(AuthGuard)
  async patch(@Param() param: UpdatePtoPayParamRequestDto, @Body() request: UpdatePtoPayRequestDto): Promise<void> {
    const command = new UpdatePtoPayCommand({
      ptoId: param.ptoId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
