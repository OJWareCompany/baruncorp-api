import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { CreateOrderedTaskCommand } from './create-ordered-task.command'
import { CreateOrderedTaskRequestDto } from './create-ordered-task.request.dto'
import { AuthGuard } from '../../../auth/authentication.guard'

@Controller('ordered-tasks')
export class CreateOrderedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  async create(@Body() request: CreateOrderedTaskRequestDto): Promise<{ orderedTaskId: string }[]> {
    const command = new CreateOrderedTaskCommand(request)
    return await this.commandBus.execute(command)
  }
}
