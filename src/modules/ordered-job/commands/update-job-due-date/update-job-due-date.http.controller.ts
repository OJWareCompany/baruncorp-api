import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateJobDueDateCommand } from './update-job-due-date.command'
import { UpdateJobDueDateParamRequestDto, UpdateJobDueDateRequestDto } from './update-job-due-date.param.request.dto'

@Controller('/jobs')
export class UpdateJobDueDateHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId/due-date')
  @UseGuards(AuthGuard)
  async updateJob(
    @User() user: UserEntity,
    @Param() param: UpdateJobDueDateParamRequestDto,
    @Body() request: UpdateJobDueDateRequestDto,
  ): Promise<void> {
    const command = new UpdateJobDueDateCommand({
      editorUserId: user.id,
      dueDate: request.dueDate,
      jobId: param.jobId,
    })

    await this.commandBus.execute(command)
  }
}
