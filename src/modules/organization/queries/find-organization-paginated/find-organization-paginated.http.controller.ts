import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Organizations } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { OrganizationPaginatedResponseDto } from '../../dtos/organization.paginated.response.dto'
import { OrganizationMapper } from '../../organization.mapper'
import { FindOrganizationPaginatedRequestDto } from './find-organization-paginated.request'
import { FindOrganizationPaginatedQuery } from './find-organization-paginated.query-handler'

@Controller('organizations')
export class FindOrganizationPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly organizationMapper: OrganizationMapper) {}

  @Get()
  @ApiOperation({ summary: 'Find Oraganization' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationPaginatedResponseDto,
  })
  async getOrganizationPaginated(
    @Query() request: FindOrganizationPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<OrganizationPaginatedResponseDto> {
    const query = new FindOrganizationPaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
      ...request,
    })

    const result: Paginated<Organizations> = await this.queryBus.execute(query)
    const entities = result.items.map(this.organizationMapper.toDomain)
    const responses = entities.map(this.organizationMapper.toPaginatedResponse)
    return new OrganizationPaginatedResponseDto({
      ...result,
      items: responses,
    })
  }
}
