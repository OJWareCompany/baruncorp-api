import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateProjectRequestDto } from './create-project.request.dto'
import { CreateProjectCommand } from './create-project.command'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { ApiResponse } from '@nestjs/swagger'

@Controller('projects')
export class CreateProjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async postCreateProejct(@User() user: UserEntity, @Body() dto: CreateProjectRequestDto): Promise<IdResponse> {
    const command = new CreateProjectCommand({
      userId: user.id,
      ...dto,
    })

    const result = await this.commandBus.execute(command)

    return new IdResponse(result.id)
  }
}
