import { Controller, Delete, HttpStatus, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { DeleteOrderedTaskCommand } from './delete-ordered-task.command'
import { DeleteOrderedTaskRequestDto } from './delete-ordered-task.request.dto'

@Controller('ordered-tasks')
export class DeleteOrderedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete ordered task.',
  })
  @Delete(':orderedTaskId')
  async delete(@Param() request: DeleteOrderedTaskRequestDto) {
    const command = new DeleteOrderedTaskCommand({
      id: request.orderedTaskId,
    })
    await this.commandBus.execute(command)
  }
}
