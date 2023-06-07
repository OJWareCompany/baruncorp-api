import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { AuthGuard } from './authentication.guard'
import { LoginReq } from './dto/request/login.req'

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginReq) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
