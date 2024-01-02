/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { UserConflictException } from '../../user.error'
import { CheckInvitedUserRequestDto } from './find-user.request.dto'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { UserStatusEnum } from '../../domain/user.types'
import UserMapper from '../../user.mapper'
import { UserResponseDto } from '../../dtos/user.response.dto'

@Controller('users')
export class CheckInvitedUserHttpController {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly userMapper: UserMapper,
  ) {}
  @Get(':userId/invitations')
  async get(@Param() request: CheckInvitedUserRequestDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneByIdOrThrow(request.userId)

    if ([UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE].includes(user.getProps().status)) {
      throw new UserConflictException()
    }

    return this.userMapper.toResponse(user)
  }
}
