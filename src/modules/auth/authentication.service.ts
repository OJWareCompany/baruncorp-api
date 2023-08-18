import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'
import { SignUpRequestDto } from './dto/request/signup.request.dto'
import { EmailVO } from '../users/domain/value-objects/email.vo'
import { InputPasswordVO } from '../users/domain/value-objects/password.vo'
import { OrganizationService } from '../organization/organization.service'
import { TokenResponseDto } from './dto/response/token.response.dto'
import { UserName } from '../users/domain/value-objects/user-name.vo'
import { UserEntity } from '../users/domain/user.entity'
import { UserRoles } from '../users/domain/value-objects/user-role.vo'
import { AccessTokenResponseDto } from './dto/response/access-token.response.dto copy'

const { JWT_REFRESH_EXPIRED_TIME, JWT_REFRESH_SECRET, JWT_EXPIRED_TIME } = process.env

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService, // ?
    private readonly organizationService: OrganizationService,
  ) {}

  async signIn(email: EmailVO, password: InputPasswordVO, response: Response): Promise<TokenResponseDto> {
    const user = await this.usersService.findUserIdByEmail(email)
    if (!user) throw new NotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = await password.compare(originalPassword)

    if (!isVerifiedPassword) {
      throw new UnauthorizedException('UnauthorizedException', '10022')
    }

    // TODO: create a class to generate the payload
    const payload = { id: user.id }
    const accessToken = await this.jwtService.signAsync(payload)
    this.setToken('token', accessToken, response)

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_REFRESH_EXPIRED_TIME,
      secret: JWT_REFRESH_SECRET,
    })
    this.setToken('refreshToken', refreshToken, response)

    return {
      accessToken,
      refreshToken,
    }
  }

  async signInCustomTokenTime(
    email: EmailVO,
    password: InputPasswordVO,
    response: Response,
    time: { jwt: number; refresh: number },
  ): Promise<TokenResponseDto> {
    const user = await this.usersService.findUserIdByEmail(email)
    if (!user) throw new NotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = await password.compare(originalPassword)

    if (!isVerifiedPassword) {
      throw new UnauthorizedException()
    }

    const payload = { id: user.id }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: time.jwt ?? JWT_EXPIRED_TIME,
    })
    this.setToken('token', accessToken, response)

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: time.refresh ?? JWT_REFRESH_EXPIRED_TIME,
      secret: JWT_REFRESH_SECRET,
    })
    this.setToken('refreshToken', refreshToken, response)

    return {
      accessToken,
      refreshToken,
    }
  }

  async signUp(signUpReq: SignUpRequestDto) {
    // TODO: Validate Code in DTO
    const { code, password, ...rest } = signUpReq

    const invitationMail = await this.usersService.findInvitationMail(code, new EmailVO(signUpReq.email))
    if (!invitationMail) throw new NotFoundException('Invitation Not Found')

    const organization = await this.organizationService.findOrganizationById(invitationMail.organizationId)
    if (!organization) throw new NotFoundException('Organization Not Found')

    const userEntity = UserEntity.create({
      email: rest.email,
      userName: new UserName({ firstName: rest.firstName, lastName: rest.lastName }),
      organizationId: organization.id,
      address: rest.address,
      phoneNumber: rest.phoneNumber,
      isActiveWorkResource: rest.isActiveWorkResource,
      isCurrentUser: rest.isCurrentUser,
      isInactiveOrganizationUser: rest.isInactiveOrganizationUser,
      isRevenueShare: rest.isRevenueShare,
      isRevisionRevenueShare: rest.isRevisionRevenueShare,
      type: rest.type,
    })

    await this.usersService.insertUser(userEntity, new InputPasswordVO(password))

    // Give User Role
    await this.usersService.giveRole({
      userId: userEntity.id,
      role: UserRoles.guest,
    })

    await this.usersService.deleteInvitationMail(code)
  }

  async refreshAccessToken(id: string, response: Response): Promise<AccessTokenResponseDto> {
    const payload = { id }
    const accessToken = await this.jwtService.signAsync(payload)
    this.setToken('token', accessToken, response)

    return {
      accessToken,
    }
  }

  // TODO: turn secure on after setup https
  private setToken(name: 'token' | 'refreshToken', token: string, res: Response) {
    const options: CookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, //1 day
      httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    }
    res.cookie(name, token, options)
  }
}