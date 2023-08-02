import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { CreateInvitationMailRequestDto } from './commands/create-invitation-mail/create-invitation-mail.request.dto'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../auth/authentication.guard'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import { ConfigModule } from '@nestjs/config'
import { UserResponseDto } from './dtos/user.response.dto'
import { EmailVO } from './domain/value-objects/email.vo'
import { UserName } from './domain/value-objects/user-name.vo'
import { GiveRoleRequestDto } from './commands/give-role/give-role.request.dto'
import { UpdateUserRequestDto } from './commands/update-user/update-user.request.dto'
import { UserRoles } from './domain/value-objects/user-role.vo'
import { CreateLicenseRequestDto } from '../users/commands/create-user-license/create-license.request.dto'
import { UserRequestDto } from './user-param.request.dto'
import { FindUserRqeustDto } from './queries/find-user.request.dto'
import { DeleteMemberLicenseRequestDto } from './commands/delete-member-license/delete-member-license.request.dto'
import { LincenseResponseDto } from './dtos/license.response.dto'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  async getFindUsers(@Query() dto: FindUserRqeustDto): Promise<UserResponseDto[]> {
    if (!dto.email) return await this.userService.findUsers()
    else if (dto.email) return [await this.userService.findOneByEmail(new EmailVO(dto.email))]
  }

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
    return await this.userService.upadteProfile(param.userId, new UserName(dto))
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async patchUpdateUser(@User() { id }: { id: string }, @Body() dto: UpdateUserRequestDto): Promise<void> {
    return await this.userService.upadteProfile(id, new UserName(dto))
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  async getRoles(): Promise<UserRoles[]> {
    return await this.userService.getRoles()
  }

  @Post('gived-roles')
  @UseGuards(AuthGuard)
  async postGiveRole(@Body() dto: GiveRoleRequestDto): Promise<void> {
    let role: UserRoles = UserRoles.guest
    if (dto.lol === 'domain') role = UserRoles.admin
    else if (dto.lol === 'manager') role = UserRoles.manager
    else if (dto.lol === 'member') role = UserRoles.member
    await this.userService.giveRole({ userId: dto.userId, role })
  }

  @Delete('gived-roles/:userId')
  @UseGuards(AuthGuard)
  async deleteRemoveRole(@Param() param: UserRequestDto): Promise<void> {
    await this.userService.removeRole(param.userId)
  }

  @Post('invitations')
  @UseGuards(AuthGuard)
  async postSendInvitationMail(@Body() dto: CreateInvitationMailRequestDto) {
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

  /**
   * 등록된 모든 라이센스 조회
   * 라이센스: 특정 State에서 작업 허가 받은 Member의 자격증
   */
  @Get('member-licenses')
  async getFindAllLicenses(): Promise<LincenseResponseDto[]> {
    const result = await this.userService.findAllLicenses()
    return result.map(
      (license) =>
        new LincenseResponseDto({
          userName: license.getProps().userName.getFullName(),
          type: license.getProps().type,
          issuingCountryName: license.getProps().stateEntity.stateName,
          abbreviation: license.getProps().stateEntity.abbreviation,
          priority: license.getProps().priority,
          issuedDate: license.getProps().issuedDate,
          expiryDate: license.getProps().expiryDate,
        }),
    )
  }

  // TODO: create api doesn't retrieve? how handel conflict error?
  @Post('member-licenses')
  @UseGuards(AuthGuard)
  async postRegisterMemberLicense(@Body() dto: CreateLicenseRequestDto): Promise<void> {
    return await this.userService.registerLicense(
      dto.userId,
      dto.type,
      dto.issuingCountryName,
      dto.abbreviation,
      dto.priority,
      new Date(dto.issuedDate),
      new Date(dto.expiryDate),
    )
  }

  /**
   * // 추후 개선 사항 -> member-licenses/:licenseId
   */
  @Delete('member-licenses')
  @UseGuards(AuthGuard)
  async deleteRemoveMemberLicense(@Query() dto: DeleteMemberLicenseRequestDto): Promise<void> {
    return await this.userService.revokeLicense(dto.userId, dto.type, dto.issuingCountryName)
  }
}
