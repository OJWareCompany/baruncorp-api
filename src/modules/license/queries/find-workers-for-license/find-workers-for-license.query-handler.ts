import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { UserRoleNameEnum } from '../../../users/domain/value-objects/user-role.vo'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindWorkersForLicenseQuery {
  readonly abbreviation: string
  readonly type: LicenseTypeEnum
  constructor(props: FindWorkersForLicenseQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindWorkersForLicenseQuery)
export class FindWorkersForLicenseQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindWorkersForLicenseQuery): Promise<Users[]> {
    const userLicenses = await this.prismaService.userLicense.findMany({
      where: { type: query.type, abbreviation: query.abbreviation },
    })

    const users = await this.prismaService.users.findMany({
      where: {
        id: { notIn: userLicenses.map((user) => user.userId) },
        OR: [
          { type: { in: [UserRoleNameEnum.admin, UserRoleNameEnum.member, UserRoleNameEnum.special_admin] } },
          { isVendor: true },
        ],
      },
    })
    return users
  }
}
