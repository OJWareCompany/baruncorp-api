import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { UpdateUserReq } from './dto/req/update-user.req'
import { CreateInvitationMailReq } from './dto/req/create-invitation-mail.req'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../auth/authentication.guard'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { ConfigModule } from '@nestjs/config'
import { UserResponseDto } from './dto/req/user.response.dto'
import { UserRoles } from './interfaces/user-role.interface'
import { GiveRoleRequestDto } from './dto/req/give-role.request.dto'
import { EmailVO } from './vo/email.vo'
import { UserName } from './vo/user-name.vo'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  async findUsers(@Query('email') email: string): Promise<UserResponseDto[]> {
    if (!email) return await this.userService.findUsers()
    else if (email) return [await this.userService.findOneByEmail(new EmailVO(email))]
  }

  /**
   * is it need a member table? since different between user and member.
   */
  @Get('profile/:userId')
  @UseGuards(AuthGuard)
  async getUserInfoByUserId(@Param('userId') userId: string): Promise<UserResponseDto> {
    return await this.userService.getUserProfile(userId)
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserInfo(@User() { id }: { id: string }): Promise<UserResponseDto> {
    return await this.userService.getUserProfile(id)
  }

  @Patch('profile/:userId')
  @UseGuards(AuthGuard)
  async updateUserByUserId(@Param('userId') userId: string, @Body() dto: UpdateUserReq): Promise<void> {
    return await this.userService.upadteProfile(userId, new UserName(dto))
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateUser(@User() { id }: { id: string }, @Body() dto: UpdateUserReq): Promise<void> {
    return await this.userService.upadteProfile(id, new UserName(dto))
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  async getRoles(): Promise<UserRoles[]> {
    return await this.userService.getRoles()
  }

  @Post('gived-roles')
  @UseGuards(AuthGuard)
  async giveRole(@Body() dto: GiveRoleRequestDto): Promise<void> {
    let role: UserRoles = UserRoles.guest
    if (dto.lol === 'domain') role = UserRoles.admin
    else if (dto.lol === 'manager') role = UserRoles.manager
    else if (dto.lol === 'member') role = UserRoles.member
    await this.userService.giveRole({ userId: dto.userId, role })
  }

  @Delete('gived-roles/:userId')
  @UseGuards(AuthGuard)
  async removeRole(@Param('userId') userId: string): Promise<void> {
    await this.userService.removeRole(userId)
  }

  @Post('invitations')
  @UseGuards(AuthGuard)
  async sendInvitationMail(@Body() dto: CreateInvitationMailReq) {
    // TODO: to VO
    const code = randomBytes(10).toString('hex').toUpperCase().slice(0, 6)

    const result = await this.userService.sendInvitationMail(dto, code)

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_USER,
      to: dto.email,
      subject: 'BarunCorp Invitation Email',
      text: `${process.env.SERVICE_HOST}  [CODE: ${code}]`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent!: ' + info.response)
      }
    })

    return result
  }
}
