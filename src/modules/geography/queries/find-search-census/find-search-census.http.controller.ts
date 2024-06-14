import { Body, Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import { CensusSearchCoordinatesService } from '../../../project/infra/census/census.search.coordinates.request.dto'
import { AddressFromMapBox } from '../../../project/infra/census/census.type.dto'
import { CoordinatesNotFoundException } from '../../../project/domain/project.error'

@Controller('search-census')
export class FindSearchCensusHttpController {
  constructor(private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService) {}
  @Get('')
  @ApiResponse({ type: CensusResponseDto })
  async searchCensus(@Body() createProjectDto: AddressFromMapBox): Promise<CensusResponseDto> {
    const { coordinates } = createProjectDto
    const censusResponse = await this.censusSearchCoordinatesService.search(coordinates)
    if (!censusResponse) throw new CoordinatesNotFoundException()
    return censusResponse
  }
}
