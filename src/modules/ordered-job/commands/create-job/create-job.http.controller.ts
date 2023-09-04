import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobRequestDto } from './create-job.request.dto'
import { CreateJobCommand } from './create-job.command'
import { AuthGuard } from '../../../auth/authentication.guard'

@Controller('jobs')
export class CreateJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() dto: CreateJobRequestDto): Promise<void> {
    const command = new CreateJobCommand({
      deliverablesEmails: dto.deliverablesEmails,
      updatedByUserId: user.id,
      clientUserIds: dto.clientUserIds,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      projectId: dto.projectId,
      orderedTasks: dto.taskIds,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
      numberOfWetStamp: dto.numberOfWetStamp,
      mountingType: dto.mountingType,
    })

    await this.commandBus.execute(command)
  }
}
