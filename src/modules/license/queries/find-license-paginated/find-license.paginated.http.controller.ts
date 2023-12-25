import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { States, UserLicense } from '@prisma/client'
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

    const result: Paginated<{ state: States; licenses: UserLicense[] }> = await this.queryBus.execute(command)

    return new LicensePaginatedResponseDto({
      page: queryParams.page,
      pageSize: queryParams.limit,
      totalCount: result.totalCount,
      items: result.items.map((item) => {
        return {
          state: item.state.stateName,
          abbreviation: item.state.abbreviation,
          type: request.type,
          workers: item.licenses.map((license) => {
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
      }),
    })
  }
}
