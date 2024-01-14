import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreatePtoCommand } from './create-pto.command'
import { CreatePtoRequestDto } from './create-pto.request.dto'
import { ApiResponse } from '@nestjs/swagger'

@Controller('ptos')
export class CreatePtoHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  // @UseGuards(AuthGuard)
  async post(@Body() dto: CreatePtoRequestDto): Promise<IdResponse> {
    const command = new CreatePtoCommand(dto)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
