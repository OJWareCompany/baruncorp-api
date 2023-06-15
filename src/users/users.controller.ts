import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { UpdateUserReq } from './dto/req/update-user.req'
import { CreateInvitationMailReq } from './dto/req/create-invitation-mail.req'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../auth/authentication.guard'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { ConfigModule } from '@nestjs/config'
ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

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
      text: `[www.barun.com] / CODE: ${code}`,
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
