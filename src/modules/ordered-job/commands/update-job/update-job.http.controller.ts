import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateJobRequestDto } from './update-job.request.dto'
import { UpdateJobCommand } from './update-job.command'
import { UpdateJobParamRequestDto } from './update-job.param.request.dto'

@Controller('jobs')
export class UpdateJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId')
  @UseGuards(AuthGuard)
  async updateJob(
    @User() user: UserEntity,
    @Param() param: UpdateJobParamRequestDto,
    @Body() dto: UpdateJobRequestDto,
  ): Promise<void> {
    const command = new UpdateJobCommand({
      deliverablesEmails: dto.deliverablesEmails,
      editorUserId: user.id,
      clientUserId: dto.clientUserId,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      jobId: param.jobId,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
      numberOfWetStamp: dto.numberOfWetStamp,
      // mountingType: dto.mountingType,
      isExpedited: dto.isExpedited,
      inReview: dto.inReview,
      priority: dto.priority,
      dueDate: dto.dueDate || null,
      structuralUpgradeNote: dto.structuralUpgradeNote,
      loadCalcOrigin: dto.loadCalcOrigin,
    })

    await this.commandBus.execute(command)
  }
}
