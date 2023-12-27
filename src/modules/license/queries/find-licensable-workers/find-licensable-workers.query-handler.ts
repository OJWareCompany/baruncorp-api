import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { UserRoleNameEnum } from '../../../users/domain/value-objects/user-role.vo'

export class FindLicensableWorkersQuery {
  // readonly abbreviation: string
  // readonly type: LicenseTypeEnum
  constructor(props: FindLicensableWorkersQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindLicensableWorkersQuery)
export class FindLicensableWorkersQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindLicensableWorkersQuery): Promise<Users[]> {
    // const userLicenses = await this.prismaService.userLicense.findMany({
    //   where: { type: query.type, abbreviation: query.abbreviation },
    // })

    const users = await this.prismaService.users.findMany({
      where: {
        // id: { notIn: userLicenses.map((user) => user.userId) },
        OR: [
          { type: { in: [UserRoleNameEnum.admin, UserRoleNameEnum.member, UserRoleNameEnum.special_admin] } },
          { isVendor: true },
        ],
      },
      orderBy: { full_name: 'asc' },
    })
    return users
  }
}
