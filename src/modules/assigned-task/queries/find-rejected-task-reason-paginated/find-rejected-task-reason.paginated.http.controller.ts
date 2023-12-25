import { Controller, Get, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PrismaService } from '../../../database/prisma.service'
import { RejectedTaskReasonPaginatedResponseDto } from '../../dtos/rejected-task-reason.response.dto'

@Controller('rejected-task-reasons')
export class FindRejectedTaskReasonHttpController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(@User() user: UserEntity): Promise<RejectedTaskReasonPaginatedResponseDto> {
    // const result = await this.prismaService.
    return new RejectedTaskReasonPaginatedResponseDto({
      page: 1,
      pageSize: 10,
      totalCount: 20,
      items: [
        {
          userId: user.id,
          userName: user.getProps().userName.getFullName(),
          taskName: 'PV Design',
          rejectedTaskId: user.id,
          rejectedAt: new Date(),
          reason: 'no no',
        },
      ],
    })
  }
}
