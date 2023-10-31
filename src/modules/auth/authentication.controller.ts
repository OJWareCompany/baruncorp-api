import { Response } from 'express'
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { AuthGuard } from './authentication.guard'
import { AuthenticationService } from './authentication.service'
import { SignInRequestDto } from './dto/request/login.reqeust.dto'
import { SignUpRequestDto } from './dto/request/signup.request.dto'
import { EmailVO } from '../users/domain/value-objects/email.vo'
import { InputPasswordVO } from '../users/domain/value-objects/password.vo'
import { TokenResponseDto } from './dto/response/token.response.dto'
import { AuthRefreshGuard } from './authentication.refresh.guard'
import { User } from '../../libs/decorators/requests/logged-in-user.decorator'
import { AccessTokenResponseDto } from './dto/response/access-token.response.dto copy'
import { ApiResponse } from '@nestjs/swagger'
import { SignInTimeRequestDto } from './dto/request/sign-in-time.request.dto'
import { SignUpTestRequestDto } from './dto/request/signup-test.request.dto'

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  postSignIn(
    @Body() signInDto: SignInRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponseDto> {
    return this.authService.signIn(new EmailVO(signInDto.email), new InputPasswordVO(signInDto.password), response)
  }

  @ApiResponse({
    description: 'The value entered for the query is in seconds. (query에 들어가는 숫자는 초 단위 입니다.)',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin-time')
  postSignInTime(
    @Body() signInDto: SignInRequestDto,
    @Query() query: SignInTimeRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponseDto> {
    if (query.jwt > 300 || query.refresh > 300) throw new BadRequestException('Too Long Time', '12345')
    return this.authService.signInCustomTokenTime(
      new EmailVO(signInDto.email),
      new InputPasswordVO(signInDto.password),
      response,
      {
        jwt: query.jwt,
        refresh: query.refresh,
      },
    )
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async postSignout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token')
    response.clearCookie('refreshToken')
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async postSignUp(@Body() signUpDto: SignUpRequestDto) {
    return await this.authService.signUp(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup-test')
  async postSignUpTest(@Body() signUpDto: SignUpTestRequestDto) {
    return await this.authService.testMemberSignup(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  getMe() {
    return
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @UseGuards(AuthRefreshGuard)
  async getRefresh(
    @User() user: { id: string }, // TODO: guard에서 반환하는 객체 정의하기
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponseDto> {
    return await this.authService.refreshAccessToken(user.id, response)
  }
}
