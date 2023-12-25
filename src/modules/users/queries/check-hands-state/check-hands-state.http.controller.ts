import { Controller, Get, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { HandsStatusResponseDto } from '../../dtos/hands-status.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../user.error'

@Controller('users')
export class CheckHandsStatusHttpController {
  constructor(private readonly prismaService: PrismaService) {}
  @Get('hands/status')
  @UseGuards(AuthGuard)
  async get(@User() user: UserEntity): Promise<HandsStatusResponseDto> {
    const result = await this.prismaService.users.findUnique({ where: { id: user.id } })
    if (!result) throw new UserNotFoundException()
    return {
      status: result.isHandRaisedForTask,
    }
  }
}
