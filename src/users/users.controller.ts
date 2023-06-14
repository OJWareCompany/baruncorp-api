import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { UpdateUserReq } from './dto/req/update-user.req'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { UserEntity } from './entites/user.entity'
import { AuthGuard } from '../auth/authentication.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Patch('')
  @UseGuards(AuthGuard)
  async updateUser(@Body() dto: UpdateUserReq, @User() user: UserEntity) {
    return await this.userService.upadteUser(user.id, dto)
  }

  @Get('myInfo')
  @UseGuards(AuthGuard)
  async getUserInfo(@User() userId: { zcode: string }) {
    console.log(userId)
    return await this.userService.getUserInfo(userId.zcode)
  }
}
