import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { Licenses } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { LicenseResponseDto, LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindLicenseQuery {
  readonly stateName: string
  readonly type: LicenseTypeEnum
  constructor(props: FindLicenseQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindLicenseQuery)
export class FindLicenseQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindLicenseQuery): Promise<LicenseResponseDto> {
    // const result = await this.prismaService.licenses.findUnique({ where: { id: query.licenseId } })
    // if (!result) throw new NotFoundException()
    return {
      type: LicenseTypeEnum.structural,
      state: 'ALASKA',
      abbreviation: 'AK',
      workers: [
        {
          userId: 'asda',
          userName: 'hyomin kim',
          type: LicenseTypeEnum.structural,
          expiryDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    }
  }
}
