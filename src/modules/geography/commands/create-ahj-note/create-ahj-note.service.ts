/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { AddressFromMapBox } from '../../../project/infra/census/census.type.dto'
import { CensusSearchCoordinatesService } from '../../../project/infra/census/census.search.coordinates.request.dto'
import { CoordinatesNotFoundException } from '../../../project/domain/project.error'
import { AhjNoteGeneratorDomainService } from '../../domain/domain-services/ahj-generator.domain-service'

@Injectable()
export class CreateAhjNoteService {
  // prisma Service같은 공통적으로 쓰일수 있는 모듈은 어떻게 관리하는가?
  constructor(
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly ahjNoteGeneratorDomainService: AhjNoteGeneratorDomainService,
  ) {}

  async searchCensusAndCreateNote(createProjectDto: AddressFromMapBox) {
    const { coordinates } = createProjectDto
    const censusResponse = await this.censusSearchCoordinatesService.search(coordinates)
    if (!censusResponse) throw new CoordinatesNotFoundException()
    await this.ahjNoteGeneratorDomainService.generateOrUpdate(censusResponse)
  }
}
