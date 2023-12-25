import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { Licenses } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { LicenseResponseDto, LicenseTypeEnum } from '../../dtos/license.response.dto'
import { StateNotFoundException } from '../../domain/license.error'

export class FindLicenseQuery {
  readonly abbreviation: string
  readonly type: LicenseTypeEnum
  constructor(props: FindLicenseQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindLicenseQuery)
export class FindLicenseQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindLicenseQuery): Promise<LicenseResponseDto> {
    const state = await this.prismaService.states.findFirst({
      where: {
        abbreviation: query.abbreviation,
      },
    })
    if (!state) throw new StateNotFoundException()

    const licenses = await this.prismaService.userLicense.findMany({
      where: {
        type: query.type,
        abbreviation: query.abbreviation,
      },
    })

    return {
      type: query.type,
      state: state.stateName,
      abbreviation: state.abbreviation,
      workers: licenses.map((license) => {
        return {
          userId: license.userId,
          userName: license.userName,
          type: license.type,
          expiryDate: license.expiryDate ? license.expiryDate.toISOString() : null,
          updatedAt: license.updatedAt.toISOString(),
          createdAt: license.createdAt.toISOString(),
        }
      }),
    }
  }
}
