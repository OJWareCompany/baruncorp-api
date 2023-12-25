/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { UserConflictException } from '../../user.error'
import { FindUserRequestDto } from './find-user.request.dto'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { UserStatusEnum } from '../../domain/user.types'

@Controller('users')
export class CheckHandsStatusHttpController {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}
  @Get(':userId/invitations')
  async get(@Param() request: FindUserRequestDto): Promise<any> {
    const user = await this.userRepo.findOneByIdOrThrow(request.userId)

    if ([UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE].includes(user.getProps().status)) {
      throw new UserConflictException()
    }
  }
}
