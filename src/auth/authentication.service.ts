import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'
import { SignUpReq } from './dto/request/signup.req'
import { EmailVO } from '../users/vo/email.vo'
import { InputPasswordVO } from '../users/vo/password.vo'

@Injectable()
export class AuthenticationService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email: EmailVO, password: InputPasswordVO, response: Response) {
    const user = await this.usersService.findUserIdByEmail(email)
    if (!user) throw new NotFoundException()

    const originalPassword = await this.usersService.findPasswordByUserId(user.id)
    const isVerifiedPassword = await password.compare(originalPassword)

    if (!isVerifiedPassword) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user.id }
    const accessToken = await this.jwtService.signAsync(payload)
    this.setToken(accessToken, response)

    return {
      accessToken,
    }
  }

  async signUp(signUpReq: SignUpReq) {
    // Check Code
    const { code, password, ...rest } = signUpReq

    const invitationMail = await this.usersService.findInvitationMail(code)
    // if (!invitationMail) throw new NotFoundException()

    // Check Company

    // Give User Role

    await this.usersService.insertUser(rest, new InputPasswordVO(password))
    await this.usersService.deleteInvitationMail(code)
  }

  // TODO: turn secure on after setup https
  setToken(token: string, res: Response) {
    const options: CookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, //1 day
      httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    }
    res.cookie('token', token, options)
  }
}
