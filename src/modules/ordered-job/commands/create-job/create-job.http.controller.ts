import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobRequestDto } from './create-job.request.dto'
import { CreateJobCommand } from './create-job.command'
import { AuthGuard } from '../../../auth/authentication.guard'

@Controller('jobs')
export class CreateJobHttpClient {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() dto: CreateJobRequestDto): Promise<void> {
    const command = new CreateJobCommand({
      deliverablesEmail: dto.deliverablesEmail,
      updatedByUserId: user.id,
      jobNumber: dto.jobNumber,
      clientUserIds: dto.clientUserIds,
      // clientContactEmail: dto.//,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      projectId: dto.projectId,
      // organizationId: dto.//,
      taskIds: dto.taskIds,
      otherServiceDescription: dto.otherServiceDescription,
      commercialJobPrice: dto.commercialJobPrice,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
    })

    await this.commandBus.execute(command)
  }
}
