import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { InviteRequestDto } from './commands/invite/invite.request.dto'
import { User } from '../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../auth/guards/authentication.guard'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { ConfigModule } from '@nestjs/config'
import { UserResponseDto } from './dtos/user.response.dto'
import { UserName } from './domain/value-objects/user-name.vo'
import { GiveRoleRequestDto } from './commands/give-role/give-role.request.dto'
import { UpdateUserRequestDto } from './commands/update-user/update-user.request.dto'
import { UserRoleNameEnum } from './domain/value-objects/user-role.vo'
import { UserRequestDto } from './user-param.request.dto'
import { InvitationEmailProp } from './domain/invitationMail.types'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  /**
   * is it need a member table? since different between user and member.
   */
  @Get('profile/:userId')
  @UseGuards(AuthGuard)
  async getUserInfoByUserId(@Param() param: UserRequestDto): Promise<UserResponseDto> {
    return await this.userService.getUserProfile(param.userId)
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserInfo(@User() { id }: { id: string }): Promise<UserResponseDto> {
    return await this.userService.getUserProfile(id)
  }

  @Patch('profile/:userId')
  @UseGuards(AuthGuard)
  async patchUpdateUserByUserId(@Param() param: UserRequestDto, @Body() dto: UpdateUserRequestDto): Promise<void> {
    return await this.userService.upadteProfile(
      param.userId,
      new UserName(dto),
      dto.phoneNumber,
      dto.deliverablesEmails,
      dto.isVendor,
    )
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async patchUpdateUser(@User() { id }: { id: string }, @Body() dto: UpdateUserRequestDto): Promise<void> {
    return await this.userService.upadteProfile(id, new UserName(dto), dto.phoneNumber, dto.deliverablesEmails)
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  async getRoles(): Promise<UserRoleNameEnum[]> {
    return await this.userService.getRoles()
  }

  @Post('make/admin')
  @UseGuards(AuthGuard)
  async postGiveRole(@Body() request: GiveRoleRequestDto): Promise<void> {
    await this.userService.makeAdmin(request.userId)
  }
}
