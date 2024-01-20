import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateJobStatusCommand } from './update-job-status.command'
import { UpdateJobStatusParamRequestDto, UpdateJobStatusRequestDto } from './update-job-status.param.request.dto'

@Controller('/jobs')
export class UpdateJobStatusHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId/status')
  @UseGuards(AuthGuard)
  async updateJob(
    @User() user: UserEntity,
    @Param() param: UpdateJobStatusParamRequestDto,
    @Body() request: UpdateJobStatusRequestDto,
  ): Promise<void> {
    const command = new UpdateJobStatusCommand({
      updatedByUserId: user.id,
      status: request.status,
      jobId: param.jobId,
    })

    await this.commandBus.execute(command)
  }
}
