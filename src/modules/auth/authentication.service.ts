import { Injectable } from '@nestjs/common'
import { UserService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'
import { EmailVO } from '../users/domain/value-objects/email.vo'
import { InputPasswordVO } from '../users/domain/value-objects/password.vo'
import { OrganizationService } from '../organization/organization.service'
import { TokenResponseDto } from './dto/response/token.response.dto'
import { AccessTokenResponseDto } from './dto/response/access-token.response.dto copy'
import { LoginException } from './auth.error'
import { UserNotFoundException } from '../users/user.error'

const { JWT_REFRESH_EXPIRED_TIME, JWT_REFRESH_SECRET, JWT_EXPIRED_TIME } = process.env

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService, // ?
  ) {}

  async signIn(email: EmailVO, password: InputPasswordVO, response: Response): Promise<TokenResponseDto> {
    const user = await this.usersService.findUserIdByEmail(email)
    if (!user) throw new UserNotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = originalPassword ? await password.compare(originalPassword) : false

    if (!isVerifiedPassword) {
      throw new LoginException()
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
    if (!user) throw new UserNotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = originalPassword ? await password.compare(originalPassword) : false

    if (!isVerifiedPassword) {
      throw new LoginException()
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
