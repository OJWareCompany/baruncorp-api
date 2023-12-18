import { Controller, Get, Param, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
// import { Licenses } from '@prisma/client'
import { LicenseResponseDto, LicenseTypeEnum } from '../../dtos/license.response.dto'
import { FindLicenseRequestParamDto, FindLicenseRequestQueryDto } from './find-license.request.dto'
import { FindLicenseQuery } from './find-license.query-handler'

@Controller('licenses')
export class FindLicenseHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':stateName')
  async get(
    @Param() request: FindLicenseRequestParamDto,
    @Query() query: FindLicenseRequestQueryDto,
  ): Promise<LicenseResponseDto> {
    const command = new FindLicenseQuery({
      stateName: request.stateName,
      type: query.type,
    })

    // const result: Licenses = await this.queryBus.execute(command)

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
