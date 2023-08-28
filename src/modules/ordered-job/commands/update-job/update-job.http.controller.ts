import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateJobRequestDto } from './update-job.request.dto'
import { UpdateJobCommand } from './update-job.command'
import { UpdateJobParamRequestDto } from './update-job.param.request.dto'

@Controller('jobs')
export class UpdateJobHttpClient {
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
      updatedByUserId: user.id,
      jobNumber: dto.jobNumber,
      clientUserIds: dto.clientUserIds,
      additionalInformationFromClient: dto.additionalInformationFromClient,
      systemSize: dto.systemSize,
      jobId: param.jobId,
      mailingAddressForWetStamp: dto.mailingAddressForWetStamp,
      numberOfWetStamp: dto.numberOfWetStamp,
      jobStatus: dto.jobStatus,
    })

    await this.commandBus.execute(command)
  }
}
