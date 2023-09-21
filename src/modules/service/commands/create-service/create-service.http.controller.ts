import { Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateServiceCommand } from './create-service.command'

@Controller('services')
export class CreateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async postCreateService() {
    const command = new CreateServiceCommand({})
    const result = await this.commandBus.execute(command)
    return result
  }
}
