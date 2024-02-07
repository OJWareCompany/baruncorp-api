import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Post, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateTrackingNumbersCommand } from './create-tracking-numbers.command'
import { CreateTrackingNumbersRequestDto } from './create-tracking-numbers.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { IdResponse } from '@libs/api/id.response.dto'
import { AggregateID } from '@libs/ddd/entity.base'
import { User } from '@libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '@modules/users/domain/user.entity'

@Controller('tracking-numbers')
export class CreateTrackingNumbersHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async post(@Body() dto: CreateTrackingNumbersRequestDto, @User() user: UserEntity): Promise<IdResponse> {
    const command: CreateTrackingNumbersCommand = new CreateTrackingNumbersCommand({
      ...dto,
      createdBy: user.id,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
