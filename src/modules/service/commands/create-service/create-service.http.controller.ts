import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { CreateServiceCommand } from './create-service.command'
import { CreateServiceRequestDto } from './create-service.request.dto'
import { AggregateID } from '@src/libs/ddd/entity.base'

@Controller('services')
export class CreateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async postCreateService(@Body() createServiceRequestDto: CreateServiceRequestDto): Promise<IdResponse> {
    const command = new CreateServiceCommand(createServiceRequestDto)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
