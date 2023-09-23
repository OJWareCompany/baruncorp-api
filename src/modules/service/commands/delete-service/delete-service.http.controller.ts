import { Body, Controller, Delete, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteServiceRequestDto } from './delete-service.request.dto'
import { DeleteServiceCommand } from './delete-service.command'

@Controller('services')
export class DeleteServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':serviceId')
  async delete(@Param() deleteServiceRequestDto: DeleteServiceRequestDto): Promise<void> {
    const command = new DeleteServiceCommand(deleteServiceRequestDto)
    await this.commandBus.execute(command)
  }
}
