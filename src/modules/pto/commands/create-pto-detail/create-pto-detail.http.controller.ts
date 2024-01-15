import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreatePtoDetailCommand } from './create-pto-detail.command'
import { CreatePtoDetailRequestDto } from './create-pto-detail.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { PastDatePtoException } from '../../domain/pto.error'

@Controller('ptos/detail')
export class CreatePtoDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async post(@Body() dto: CreatePtoDetailRequestDto): Promise<IdResponse> {
    const command = new CreatePtoDetailCommand({
      ...dto,
    })

    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
