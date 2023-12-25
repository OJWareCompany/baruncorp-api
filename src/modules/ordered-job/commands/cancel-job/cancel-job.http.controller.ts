import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CancelJobCommand } from './cancel-job.command'
import { CancelJobParamRequestDto } from './cancel-job.param.request.dto'

@Controller('jobs/cancel')
export class CancelJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId')
  @UseGuards(AuthGuard)
  async updateJob(@User() user: UserEntity, @Param() param: CancelJobParamRequestDto): Promise<void> {
    const command = new CancelJobCommand({
      updatedByUserId: user.id,
      jobId: param.jobId,
    })

    await this.commandBus.execute(command)
  }
}
