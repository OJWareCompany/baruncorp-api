import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateProjectRequestDto } from './create-project.request.dto'
import { CreateProjectCommand } from './create-project.command'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'

@Controller('projects')
export class CreateProjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async postCreateProejct(
    @User() user: UserEntity,
    @Body() dto: CreateProjectRequestDto,
  ): Promise<{ projectId: string }> {
    const command = new CreateProjectCommand({
      userId: user.id,
      ...dto,
    })
    return await this.commandBus.execute(command)
  }
}
