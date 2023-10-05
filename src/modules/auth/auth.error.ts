import { ForbiddenException, UnauthorizedException } from '@nestjs/common'

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('expired token', '10005')
  }
}
export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super('expired refresh token', '10006')
  }
}

export class TokenNotFoundException extends UnauthorizedException {
  constructor() {
    super('not token found.', '10007')
  }
}

export class LoginException extends UnauthorizedException {
  constructor() {
    super('UnauthorizedException', '10022')
  }
}

export class ProperAuthForbiddenException extends ForbiddenException {
  constructor() {
    super('does not have proper authorization.', '10010')
  }
}

export class AdminOnlyException extends ForbiddenException {
  constructor() {
    super('only admin could access', '10019')
  }
}
