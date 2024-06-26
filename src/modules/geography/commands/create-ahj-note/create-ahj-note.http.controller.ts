import { Body, Controller, Post } from '@nestjs/common'
import { AddressFromMapBox } from '../../../project/infra/census/census.type.dto'
import { CreateAhjNoteService } from './create-ahj-note.service'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import { ApiResponse } from '@nestjs/swagger'

// TODO: Census 검색결과 반환해야함.
@Controller('search-census')
export class SearchCensusHttpController {
  constructor(private readonly ahjnoteService: CreateAhjNoteService) {}
  /**
   * Census에서 행정구역이 매칭되지 않는 주소들이 있음
   * Census 결과와 상관 없이 프로젝트는 생성되어야함
   */
  @Post('')
  @ApiResponse({ type: CensusResponseDto })
  async postSearchCensus(@Body() createProjectDto: AddressFromMapBox): Promise<CensusResponseDto> {
    return await this.ahjnoteService.searchCensusAndCreateNote(createProjectDto)
  }
}

/**
 * geography repository를 import해서 쓰자니 모듈화가 안된다.
 * 이벤트로 전달하면 되는걸까?
 * 지금 필요한 부분이 아니니까 나중에 알아보자.
 * 일단 geo관련한건 geo repo에서 구현하는걸로
 */
