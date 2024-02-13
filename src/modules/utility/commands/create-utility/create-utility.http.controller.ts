import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { ApiResponse } from '@nestjs/swagger'
import { CreateUtilityRequestDto } from '@modules/utility/commands/create-utility/create-utility.request.dto'
import { CreateUtilityCommand } from '@modules/utility/commands/create-utility/create-utility.command'
import { User } from '@libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '@modules/users/domain/user.entity'

@Controller('utilities')
export class CreateUtilityHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() dto: CreateUtilityRequestDto): Promise<IdResponse> {
    const command: CreateUtilityCommand = new CreateUtilityCommand({
      updatedBy: user.id,
      ...dto,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
