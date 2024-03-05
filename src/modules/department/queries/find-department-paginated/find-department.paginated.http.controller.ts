import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Departments } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { DepartmentPaginatedResponseDto } from '../../dtos/department.paginated.response.dto'
import { FindDepartmentPaginatedRequestDto } from './find-department.paginated.request.dto'
import { FindDepartmentPaginatedQuery } from './find-department.paginated.query-handler'

@Controller('departments')
export class FindDepartmentPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindDepartmentPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<DepartmentPaginatedResponseDto> {
    const command = new FindDepartmentPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<Departments> = await this.queryBus.execute(command)

    return new DepartmentPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        ...item,
      })),
    })
  }
}
