import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'
import { SignUpReq } from './dto/request/signup.req'
import { EmailVO } from '../users/vo/email.vo'
import { InputPasswordVO } from '../users/vo/password.vo'
import { CompanyService } from '../company/company.service'
import { TokenResponse } from './dto/response/token.res'
import { UserProp } from 'src/users/interfaces/user.interface'

const { JWT_REFRESH_EXPIRED_TIME, JWT_REFRESH_SECRET, JWT_SECRET } = process.env

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly companyService: CompanyService,
  ) {}

  async signIn(email: EmailVO, password: InputPasswordVO, response: Response): Promise<TokenResponse> {
    const user = await this.usersService.findUserIdByEmail(email)
    if (!user) throw new NotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = await password.compare(originalPassword)

    if (!isVerifiedPassword) {
      throw new UnauthorizedException()
    }

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

  async signUp(signUpReq: SignUpReq) {
    // Check Code
    const { code, password, ...rest } = signUpReq

    const invitationMail = await this.usersService.findInvitationMail(code, new EmailVO(signUpReq.email))
    if (!invitationMail) throw new NotFoundException('Invitation Not Found')

    const company = await this.companyService.findCompanyById(invitationMail.companyId)
    if (!company) throw new NotFoundException('Company Not Found')

    const user = await this.usersService.insertUser(company.id, rest, new InputPasswordVO(password))

    // Give User Role
    await this.companyService.giveUserRole({
      userId: user.id,
      role: invitationMail.role,
      companyType: invitationMail.companyType,
    })

    await this.usersService.deleteInvitationMail(code)
  }

  async refreshAccessToken(user: UserProp, response: Response): Promise<{ accessToken: string }> {
    const payload = { id: user.id }
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
