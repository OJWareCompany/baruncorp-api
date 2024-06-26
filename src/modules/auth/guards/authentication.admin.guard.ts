import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../constants'
import { Request } from 'express'
import { PrismaService } from '../../database/prisma.service'
import UserMapper from '../../users/user.mapper'
import { UserNotFoundException } from '../../users/user.error'
import { AdminOnlyException, LoginException, ProperAuthForbiddenException, TokenNotFoundException } from '../auth.error'
import { UserRoleNameEnum } from '../../users/domain/value-objects/user-role.vo'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
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
      const user = await this.prismaService.users.findUnique({
        where: { id: payload.id },
        include: {
          organization: true,
          userRole: { include: { role: true } },
          userPosition: { include: { position: true } },
          licenses: true,
          availableTasks: { include: { task: true } },
        },
      })
      if (!user) throw new UserNotFoundException()
      request['user'] = this.userMapper.toDomain(user)
      if (user.userRole?.roleName !== UserRoleNameEnum.admin) throw new AdminOnlyException()
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new LoginException()
      }
      throw new ProperAuthForbiddenException()
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
