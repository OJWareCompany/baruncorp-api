import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthenticationService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email: string, pass: string, response: Response) {
    const user = await this.usersService.findOne(email)
    const isVerifiedPassword = await bcrypt.compare(pass, user.password)

    if (!isVerifiedPassword) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user.userId, username: user.username }
    const access_token = await this.jwtService.signAsync(payload)
    this.setToken(access_token, response)

    return {
      access_token,
    }
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
