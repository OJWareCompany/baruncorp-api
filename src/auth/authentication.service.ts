import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthenticationService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email, pass) {
    const user = await this.usersService.findOne(email)

    if (user?.password !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.userId, username: user.userId }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
