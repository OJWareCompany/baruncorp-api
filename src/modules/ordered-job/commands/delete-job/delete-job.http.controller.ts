import { Controller, Delete, HttpStatus, Param } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { DeleteJobCommand } from './delete-job.command'
import { DeleteJobRequestDto } from './delete-job.request.dto'

@Controller('jobs')
export class DeleteJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete job if it has no tasks.',
  })
  @Delete(':jobId')
  async delete(@Param() request: DeleteJobRequestDto) {
    const command = new DeleteJobCommand({
      id: request.jobId,
    })
    await this.commandBus.execute(command)
  }
}
