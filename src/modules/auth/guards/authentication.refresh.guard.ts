import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { RefreshTokenExpiredException, TokenNotFoundException } from '../auth.error'

const { JWT_REFRESH_SECRET } = process.env

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request) ?? this.extractTokenFromCookie(request)

    if (!token) {
      throw new TokenNotFoundException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_REFRESH_SECRET,
      })
      request['user'] = payload
    } catch {
      throw new RefreshTokenExpiredException()
    }
    return true
  }

  // TODO: Use http-only Cookie
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private extractTokenFromCookie(request: Request) {
    return request.cookies.refreshToken
  }
}
