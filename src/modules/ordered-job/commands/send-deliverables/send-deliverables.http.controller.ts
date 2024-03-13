import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { SendDeliverablesParamRequestDto } from './send-deliverables.param.request.dto'

@Controller('jobs')
export class SendDeliverablesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId/send-deliverables')
  @UseGuards(AuthGuard)
  async updateJob(@User() user: UserEntity, @Param() param: SendDeliverablesParamRequestDto): Promise<void> {
    const command = new SendDeliverablesCommand({
      editorUserId: user.id,
      jobId: param.jobId,
    })

    await this.commandBus.execute(command)
  }
}
