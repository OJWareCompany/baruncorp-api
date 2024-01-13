import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards, HttpStatus } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePtoDetailCommand } from './delete-pto-detail.command'
import { DeletePtoDetailParamRequestDto } from './delete-pto-detail.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('ptos')
export class DeletePtoDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':ptoDetailId/detail')
  // @UseGuards(AuthGuard)
  async delete(@Param() param: DeletePtoDetailParamRequestDto) {
    const command = new DeletePtoDetailCommand({
      ptoDetailId: param.ptoDetailId,
    })
    await this.commandBus.execute(command)
  }
}
