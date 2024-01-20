import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Post } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateInformationCommand } from './create-information.command'
import { CreateInformationParamRequestDto, CreateInformationRequestDto } from './create-information.request.dto'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'

@Controller('informations')
export class CreateInformationHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async patch(@Body() dto: CreateInformationRequestDto): Promise<IdResponse> {
    const command = new CreateInformationCommand(dto)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
