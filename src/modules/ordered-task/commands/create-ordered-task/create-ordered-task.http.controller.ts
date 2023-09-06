import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { CreateOrderedTaskCommand } from './create-ordered-task.command'
import { CreateOrderedTaskRequestDto } from './create-ordered-task.request.dto'
import { AuthGuard } from '../../../auth/authentication.guard'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('ordered-tasks')
export class CreateOrderedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  async create(@Body() request: CreateOrderedTaskRequestDto): Promise<IdResponse[]> {
    const command = new CreateOrderedTaskCommand(request)
    const result = await this.commandBus.execute(command)
    return result.ids.map((id: string) => new IdResponse(id))
  }
}
