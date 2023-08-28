import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateJobRequestDto } from './update-job.request.dto'
import { UpdateJobCommand } from './update-job.command'

@Controller('jobs')
export class UpdateJobHttpClient {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async updateJob(@User() user: UserEntity, @Body() dto: UpdateJobRequestDto): Promise<void> {
    const command = new UpdateJobCommand({
      deliverablesEmails: dto.deliverablesEmails,
      updatedByUserId: user.id,
      jobNumber: dto.jobNumber,
      clientUserIds: dto.clientUserIds,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      jobId: dto.jobId,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
      numberOfWetStamp: dto.numberOfWetStamp,
    })

    await this.commandBus.execute(command)
  }
}
