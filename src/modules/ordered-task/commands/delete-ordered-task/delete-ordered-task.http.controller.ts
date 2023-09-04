import { Controller, Delete, HttpStatus, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { DeleteOrderedTaskCommand } from './delete-ordered-task.command'
import { DeleteOrderedTaskRequestDto } from './delete-ordered-task.request.dto'

@Controller('orderd-tasks')
export class DeleteOrderedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete ordered task.',
  })
  @Delete(':orderdTaskId')
  async delete(@Param() request: DeleteOrderedTaskRequestDto) {
    const command = new DeleteOrderedTaskCommand({
      id: request.orderdTaskId,
    })
    await this.commandBus.execute(command)
  }
}
