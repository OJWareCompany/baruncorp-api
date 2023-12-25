import { Controller, Get, Param, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
// import { Licenses } from '@prisma/client'
import { LicenseResponseDto, LicenseTypeEnum } from '../../dtos/license.response.dto'
import { FindLicenseRequestParamDto, FindLicenseRequestQueryDto } from './find-license.request.dto'
import { FindLicenseQuery } from './find-license.query-handler'

@Controller('licenses')
export class FindLicenseHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':abbreviation')
  async get(
    @Param() request: FindLicenseRequestParamDto,
    @Query() query: FindLicenseRequestQueryDto,
  ): Promise<LicenseResponseDto> {
    const command = new FindLicenseQuery({
      abbreviation: request.abbreviation,
      type: query.type,
    })

    const result: LicenseResponseDto = await this.queryBus.execute(command)

    return result
  }
}
