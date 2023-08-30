import { Controller, Delete, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteProjectRequestDto } from './delete-project.request.dto'
import { DeleteProjectCommand } from './delete-project.command'

@Controller('projects')
export class DeleteProjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':projectId')
  async delete(@Param() request: DeleteProjectRequestDto): Promise<void> {
    const command = new DeleteProjectCommand({ id: request.projectId })
    await this.commandBus.execute(command)
  }
}
