import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Res } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { AuthGuard } from './authentication.guard'
import { LoginReq } from './dto/request/login.req'
import { Response } from 'express'

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginReq, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(signInDto.email, signInDto.password, response)
  }

  // TODO: Generate SignUp Controller

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
