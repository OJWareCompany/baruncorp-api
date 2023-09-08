import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FindOrganizationRequestDto } from './find-orginazation.request.dto'
import { OrganizationResponseDto } from '../../dtos/organization.response.dto'
import { FindOrganizationQuery } from './find-orginazation.query-handler'

@Controller('organizations')
export class FindOrganizationHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'find organization.' })
  @ApiResponse({ status: HttpStatus.OK, type: OrganizationResponseDto })
  @Get(':organizationId')
  async get(@Param() request: FindOrganizationRequestDto): Promise<OrganizationResponseDto> {
    const query = new FindOrganizationQuery(request)
    const result = await this.queryBus.execute(query)
    return result
  }
}
