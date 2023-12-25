import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { HoldJobCommand } from './hold-job.command'
import { HoldJobParamRequestDto } from './hold-job.param.request.dto'

@Controller('jobs/hold')
export class HoldJobHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':jobId')
  @UseGuards(AuthGuard)
  async updateJob(@User() user: UserEntity, @Param() param: HoldJobParamRequestDto): Promise<void> {
    const command = new HoldJobCommand({
      updatedByUserId: user.id,
      jobId: param.jobId,
    })

    await this.commandBus.execute(command)
  }
}
