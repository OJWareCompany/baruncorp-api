/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import { GEOGRAPHY_REPOSITORY } from '../../geography.di-token'
import { GeographyRepositoryPort } from '../../database/geography.repository.port'
import { AhjNoteFolderData } from '../../../filesystem/infra/filesystem.api.type'
import { GoogleAhjNoteFolderDomainService } from '../../../filesystem/domain/domain-service/google-ahj-note-folder.domain-service'

@Injectable()
export class AhjNoteGeneratorDomainService {
  constructor(
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepo: GeographyRepositoryPort,
    private readonly googleAhjNoteFolderDomainService: GoogleAhjNoteFolderDomainService,
  ) {}

  async generateOrUpdate(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto
    const ahjNoteFolderDatas: AhjNoteFolderData[] = []

    /**
     * State & Notes
     */
    state && (await this.geographyRepo.createState(state))
    state && (await this.geographyRepo.updateStateNote(state))
    /**
     * @FilesystemLogic
     */
    state &&
      (await this.googleAhjNoteFolderDomainService.addAhjNoteFolderData(ahjNoteFolderDatas, {
        geoId: state.geoId,
        fullAhjName: state.stateLongName,
      }))

    /**
     * County & Notes
     */
    county && (await this.geographyRepo.createCounty(county))
    county && (await this.geographyRepo.updateCountyNote(county, state))
    /**
     * @FilesystemLogic
     */
    county &&
      (await this.googleAhjNoteFolderDomainService.addAhjNoteFolderData(ahjNoteFolderDatas, {
        geoId: county.geoId,
        fullAhjName: county.countyLongName,
      }))

    /**
     * County Subdivisions & Note
     */
    countySubdivisions && (await this.geographyRepo.createCountySubdivisions(countySubdivisions))
    countySubdivisions && (await this.geographyRepo.updateCountySubdivisionsNote(countySubdivisions, state, county))
    /**
     * @FilesystemLogic
     */
    countySubdivisions &&
      (await this.googleAhjNoteFolderDomainService.addAhjNoteFolderData(ahjNoteFolderDatas, {
        geoId: countySubdivisions.geoId,
        fullAhjName: countySubdivisions.longName,
      }))

    /**
     * Place & Note
     */
    place && (await this.geographyRepo.createPlace(place))
    place && (await this.geographyRepo.updatePlaceNote(place, state, county, countySubdivisions))
    /**
     * @FilesystemLogic
     */
    place &&
      (await this.googleAhjNoteFolderDomainService.addAhjNoteFolderData(ahjNoteFolderDatas, {
        geoId: place.geoId,
        fullAhjName: place.placeLongName,
      }))

    /**
     * @FilesystemLogic
     */
    await this.googleAhjNoteFolderDomainService.createAhjNoteFolders(ahjNoteFolderDatas)

    return censusResponseDto
  }
}
