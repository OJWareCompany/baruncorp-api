import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch } from '@nestjs/common'
import { UpdateServiceRequestDto, UpdateServiceRequestDtoParam } from './update-service.request.dto'
import { UpdateServiceCommand } from './update-service.command'

@Controller('services')
export class UpdateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':serviceId')
  async patch(@Param() param: UpdateServiceRequestDtoParam, @Body() request: UpdateServiceRequestDto): Promise<void> {
    const command = new UpdateServiceCommand({
      serviceId: param.serviceId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
