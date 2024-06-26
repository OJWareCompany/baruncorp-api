import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobRequestDto } from './create-job.request.dto'
import { CreateJobCommand } from './create-job.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { LoadCalcOriginEnum } from '../../domain/job.type'

@Controller('jobs')
export class CreateJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() dto: CreateJobRequestDto): Promise<IdResponse> {
    const command = new CreateJobCommand({
      deliverablesEmails: dto.deliverablesEmails,
      updatedByUserId: user.id,
      clientUserId: dto.clientUserId,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      projectId: dto.projectId,
      orderedTasks: dto.taskIds,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
      numberOfWetStamp: dto.numberOfWetStamp,
      mountingType: dto.mountingType,
      isExpedited: dto.isExpedited,
      loadCalcOrigin: dto.loadCalcOrigin || LoadCalcOriginEnum.ByBarunCorp,
      dueDate: dto.dueDate || null,
      editorUserId: user.id,
      structuralUpgradeNote: dto.structuralUpgradeNote,
      priority: dto.priority,
    })
    const result = await this.commandBus.execute(command)
    return new IdResponse(result.id)
  }
}
