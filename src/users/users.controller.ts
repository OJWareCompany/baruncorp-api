import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { UpdateUserReq } from './dto/req/update-user.req'
import { CreateInvitationMailReq } from './dto/req/create-invitation-mail.req'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../auth/authentication.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateUser(@Body() dto: UpdateUserReq, @User() user: { zcode: string }) {
    return await this.userService.upadteProfile(user.zcode, dto)
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserInfo(@User() userId: { zcode: string }) {
    return await this.userService.getUserProfile(userId.zcode)
  }

  @Post('invitations')
  @UseGuards(AuthGuard)
  async sendInvitationMail(@Body() dto: CreateInvitationMailReq) {
    return await this.userService.sendInvitationMail(dto)
  }
}
