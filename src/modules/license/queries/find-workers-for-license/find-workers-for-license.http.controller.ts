import { Controller, Get, Param, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import {
  FindWorkersForLicenseRequestDto,
  FindWorkersForLicenseRequestParamDto,
} from './find-workers-for-license.request.dto'
import { FindWorkersForLicenseQuery } from './find-workers-for-license.query-handler'
import { PositionUnregisteredUserResponseDto } from '../../../position/dtos/position-unregistered-user.response.dto'

@Controller('licenses')
export class FindWorkersForLicenseHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':abbreviation/workers')
  async get(
    @Param() param: FindWorkersForLicenseRequestParamDto,
    @Query() request: FindWorkersForLicenseRequestDto,
  ): Promise<PositionUnregisteredUserResponseDto> {
    const command = new FindWorkersForLicenseQuery({
      abbreviation: param.abbreviation,
      type: request.type,
    })

    const result: Users[] = await this.queryBus.execute(command)

    return {
      items: result.map((user) => {
        return {
          userId: user.id,
          email: user.email,
          userName: user.firstName + ' ' + user.lastName,
        }
      }),
    }
  }
}
