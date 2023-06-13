import { Response } from 'express'
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Res } from '@nestjs/common'
import { AuthGuard } from './authentication.guard'
import { AuthenticationService } from './authentication.service'
import { LoginReq } from './dto/request/login.req'
import { SignUpReq } from './dto/request/signup.req'
import { EmailVO } from '../users/vo/email.vo'
import { InputPasswordVO } from '../users/vo/password.vo'

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginReq, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(new EmailVO(signInDto.email), new InputPasswordVO(signInDto.password), response)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpReq) {
    return await this.authService.signUp(signUpDto)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
