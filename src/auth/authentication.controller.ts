import { Response } from 'express'
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { AuthGuard } from './authentication.guard'
import { AuthenticationService } from './authentication.service'
import { LoginReq } from './dto/request/login.req.dto'
import { SignUpReq } from './dto/request/signup.req.dto'
import { EmailVO } from '../users/vo/email.vo'
import { InputPasswordVO } from '../users/vo/password.vo'
import { TokenResponse } from './dto/response/token.res.dto'
import { AuthRefreshGuard } from './authentication.refresh.guard'
import { User } from '../common/decorators/requests/logged-in-user.decorator'

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: LoginReq, @Res({ passthrough: true }) response: Response): Promise<TokenResponse> {
    return this.authService.signIn(new EmailVO(signInDto.email), new InputPasswordVO(signInDto.password), response)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin-time')
  signInTime(
    @Body() signInDto: LoginReq,
    @Query('jwt') jwt: number,
    @Query('refresh') refresh: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    if (jwt > 300 || refresh > 300) throw new BadRequestException('Too Long Time', '12345')
    return this.authService.signInCustomTokenTime(
      new EmailVO(signInDto.email),
      new InputPasswordVO(signInDto.password),
      response,
      { jwt, refresh },
    )
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token')
    response.clearCookie('refreshToken')
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpReq) {
    return await this.authService.signUp(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  me() {
    return
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @UseGuards(AuthRefreshGuard)
  async refresh(
    @User() user: { id: string }, // TODO: guard에서 반환하는 객체 정의하기
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(user.id, response)
  }
}
