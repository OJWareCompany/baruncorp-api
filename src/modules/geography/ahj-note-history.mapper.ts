import { Mapper } from '@libs/ddd/mapper.interface'
import { AHJNoteHistoryModel } from './database/geography.repository'
import { AHJType } from './dto/ahj-note.response.dto'
import { AhjNoteHistoryListResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { AhjNoteHistoryResponseDto } from './dto/ahj-note-history.response.dto'

export class AhjNoteHistoryMapper implements Mapper<any, AHJNoteHistoryModel, AhjNoteHistoryResponseDto> {
  toPersistence(entity: any): AHJNoteHistoryModel {
    throw new Error('Method not implemented.')
  }

  /**
   * 일관성을 위해서
   * e.g. Request Dto등에서 필드명이 달라질수있음.. (how to disallow extra properties)
   */
  toDomain(record: any, ...entity: any) {
    throw new Error('Method not implemented.')
  }

  toResponse(model: AHJNoteHistoryModel): AhjNoteHistoryResponseDto {
    let type: AHJType = AHJType.STATE
    if (model.geoIdCounty) type = AHJType.COUNTY
    if (model.geoIdCountySubdivision) type = AHJType.COUNTY_SUBDIVISIONS
    if (model.geoIdPlace) type = AHJType.PLACE

    const response = new AhjNoteHistoryResponseDto()
    response.id = model.id

    response.general = {
      website: model.website,
      specificFormRequired: model.specificFormRequired,
      generalNotes: model.generalNotes,
      buildingCodes: model.buildingCodes,
      name: model.name,
      fullAhjName: model.fullAhjName,
      updatedBy: model.updatedBy,
      createdAt: model?.createdAt?.toISOString(),
      updatedAt: model?.updatedAt?.toISOString(),
      type: type,
    }

    response.design = {
      fireSetBack: model.fireSetBack,
      utilityNotes: model.utilityNotes,
      designNotes: model.designNotes,
      pvMeterRequired: model.pvMeterRequired,
      acDisconnectRequired: model.acDisconnectRequired,
      centerFed120Percent: model.centerFed120Percent,
      deratedAmpacity: model.deratedAmpacity,
    }

    response.engineering = {
      engineeringNotes: model.engineeringNotes,
      iebcAccepted: model.iebcAccepted,
      structuralObservationRequired: model.structuralObservationRequired,
      windUpliftCalculationRequired: model.windUpliftCalculationRequired,
      wetStampsRequired: model.wetStampsRequired,
      digitalSignatureType: model.digitalSignatureType,
      windExposure: model.windExposure,
      wetStampSize: model.wetStampSize,
      windSpeed: model.windSpeed,
      snowLoadGround: model.snowLoadGround,
      snowLoadFlatRoof: model.snowLoadFlatRoof,
      // snowLoadSlopedRoof: model.snowLoadSlopedRoof,
      ofWetStamps: model.ofWetStamps,
    }

    response.electricalEngineering = {
      electricalNotes: model.electricalNotes,
    }

    // for history id
    const id = model['id'] ? { id: model['id'] } : undefined
    return {
      ...id,
      ...response,
    }
  }

  toListResponse(model: AHJNoteHistoryModel): AhjNoteHistoryListResponseDto {
    const response = new AhjNoteHistoryListResponseDto()
    response.id = model.id
    response.geoId = model.geoId
    response.name = model.name
    response.fullAhjName = model.fullAhjName
    response.updatedBy = model.updatedBy
    response.updatedAt = model.updatedAt.toISOString()
    return response
  }
}
