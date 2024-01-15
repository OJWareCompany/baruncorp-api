import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePtoDetailCommand } from './update-pto-detail.command'
import { UpdatePtoDetailRequestDto, UpdatePtoDetailParamRequestDto } from './update-pto-detail.request.dto'

@Controller('ptos')
export class UpdatePtoDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':ptoDetailId/detail')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdatePtoDetailParamRequestDto,
    @Body() request: UpdatePtoDetailRequestDto,
  ): Promise<void> {
    const command = new UpdatePtoDetailCommand({
      ptoDetailId: param.ptoDetailId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
