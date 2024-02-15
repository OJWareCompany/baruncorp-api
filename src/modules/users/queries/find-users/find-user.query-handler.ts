/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { UserRepositoryPort } from '../../database/user.repository.port'
import { UserResponseDto } from '../../dtos/user.response.dto'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { FindUsersQuery } from './find-user.query'
import UserMapper from '../../user.mapper'
import { UserRepository } from '../../database/user.repository'

@QueryHandler(FindUsersQuery)
export class FindUserQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(query: FindUsersQuery): Promise<Paginated<UserResponseDto>> {
    const whereInput: Prisma.UsersWhereInput = {
      ...(query.email && { email: { contains: query.email } }),
      ...(query.organizationId && { organizationId: query.organizationId }),
      ...(query.organizationName && { organization: { name: { contains: query.organizationName } } }),
      ...(query.isContractor !== null && query.isContractor !== undefined && { isVendor: query.isContractor }),
      ...(query.userName && { full_name: { contains: query.userName } }),
      ...(query.status && { status: query.status }),
    }

    const records = await this.prismaService.users.findMany({
      where: whereInput,
      include: UserRepository.userQueryIncludeInput,
      skip: query.offset,
      take: query.limit,
    })

    const result = records.map(this.userMapper.toDomain).map(this.userMapper.toResponse)

    const totalCount = await this.prismaService.users.count({
      where: whereInput,
    })

    return new Paginated({
      items: result,
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
