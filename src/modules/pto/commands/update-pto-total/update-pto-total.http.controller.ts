import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePtoTotalCommand } from './update-pto-total.command'
import { UpdatePtoTotalRequestDto, UpdatePtoTotalParamRequestDto } from './update-pto-total.request.dto'

@Controller('ptos')
export class UpdatePtoTotalHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':ptoId/total')
  // @UseGuards(AuthGuard)
  async patch(@Param() param: UpdatePtoTotalParamRequestDto, @Body() request: UpdatePtoTotalRequestDto): Promise<void> {
    const command = new UpdatePtoTotalCommand({
      ptoId: param.ptoId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
