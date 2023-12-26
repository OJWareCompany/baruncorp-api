/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../constants'
import { Request } from 'express'
import { USER_REPOSITORY } from '../../users/user.di-tokens'
import { UserRepository } from '../../users/database/user.repository'
import { UserRoleNameEnum } from '../../users/domain/value-objects/user-role.vo'
import { AdminOnlyException, ProperAuthForbiddenException, TokenNotFoundException } from '../auth.error'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request) ?? this.extractTokenFromCookie(request)

    if (!token) {
      throw new TokenNotFoundException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      })
      // TODO: what data needed
      const user = await this.userRepository.findOneByIdOrThrow(payload.id)
      if (user.role !== UserRoleNameEnum.admin) throw new AdminOnlyException()

      request['user'] = user
    } catch {
      throw new ProperAuthForbiddenException()
    }
    return true
  }

  // TODO: Use http-only Cookie
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private extractTokenFromCookie(request: Request) {
    return request.cookies.token
  }
}