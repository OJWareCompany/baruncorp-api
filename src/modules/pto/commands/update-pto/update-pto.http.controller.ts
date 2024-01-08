import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePtoCommand } from './update-pto.command'
import { UpdatePtoRequestDto, UpdatePtoParamRequestDto } from './update-pto.request.dto'

@Controller('ptos')
export class UpdatePtoHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':ptoId')
  @UseGuards(AuthGuard)
  async patch(@Param() param: UpdatePtoParamRequestDto, @Body() request: UpdatePtoRequestDto): Promise<void> {
    const command = new UpdatePtoCommand({
      ptoId: param.ptoId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
