import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import { CensusSearchCoordinatesService } from '../../../project/infra/census/census.search.coordinates.request.dto'
import { AddressFromMapBox, AddressFromMapBoxRequestQueryDto } from '../../../project/infra/census/census.type.dto'
import { CoordinatesNotFoundException } from '../../../project/domain/project.error'

@Controller('search-census')
export class FindSearchCensusHttpController {
  constructor(private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService) {}
  @Get('')
  @ApiResponse({ type: CensusResponseDto })
  async searchCensus(@Query() createProjectDto: AddressFromMapBoxRequestQueryDto): Promise<CensusResponseDto> {
    const { x, y } = createProjectDto
    const censusResponse = await this.censusSearchCoordinatesService.search([x, y])
    if (!censusResponse) throw new CoordinatesNotFoundException()
    return censusResponse
  }
}
