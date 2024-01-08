import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards, HttpStatus } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePtoCommand } from './delete-pto.command'
import { DeletePtoParamRequestDto } from './delete-pto.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('ptos')
export class DeletePtoHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':ptoId')
  @UseGuards(AuthGuard)
  async delete(@Param() param: DeletePtoParamRequestDto) {
    const command = new DeletePtoCommand({
      ptoId: param.ptoId,
    })
    await this.commandBus.execute(command)
  }
}
