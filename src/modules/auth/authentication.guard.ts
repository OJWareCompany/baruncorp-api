import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { Request } from 'express'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request) ?? this.extractTokenFromCookie(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      })
      // TODO: what data needed
      const user = await this.userRepository.findOneById(payload.id)
      request['user'] = user
    } catch {
      throw new UnauthorizedException('Authentication Issue', '10005')
    }
    return true
  }

  // TODO: Use http-only Cookie
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    const regExp = /[\{\}\[\]\/\?\*\~\!\@\#\$\%\^\&\*\(\-\_\"\'\,]/
    return type === 'Bearer' && token && !regExp.test(token[0]) ? token : undefined
  }

  private extractTokenFromCookie(request: Request) {
    return request.cookies.token
  }
}