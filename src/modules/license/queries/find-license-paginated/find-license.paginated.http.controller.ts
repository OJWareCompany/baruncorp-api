import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { UserLicense } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { LicensePaginatedResponseDto } from '../../dtos/license.paginated.response.dto'
import { FindLicensePaginatedRequestDto } from './find-license.paginated.request.dto'
import { FindLicensePaginatedQuery } from './find-license.paginated.query-handler'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

@Controller('licenses')
export class FindLicensePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindLicensePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<LicensePaginatedResponseDto> {
    const command = new FindLicensePaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<UserLicense> = await this.queryBus.execute(command)

    return new LicensePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: [
        {
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
        },
      ],
    })
  }
}
