import { Mapper } from '@libs/ddd/mapper.interface'
import { AHJNoteHistoryModel, AHJNotesModel } from './database/geography.repository'
import { AHJType, AhjNoteResponseDto } from './dto/ahj-note.response.dto'
import { AhjNoteListResponseDto } from './dto/ahj-note.paginated.response.dto'
import { AhjNoteHistoryListResponseDto } from './dto/ahj-note-history.paginated.response.dto'

export class AhjNoteMapper implements Mapper<any, AHJNotesModel, AhjNoteResponseDto> {
  toPersistence(entity: any): AHJNotesModel {
    throw new Error('Method not implemented.')
  }

  /**
   * 일관성을 위해서
   * e.g. Request Dto등에서 필드명이 달라질수있음.. (how to disallow extra properties)
   */
  toDomain(record: any, ...entity: any) {
    throw new Error('Method not implemented.')
  }

  /**
   * Swagger에서 UNION 타입을 표현하기 위해 enum을 사용했으나, DB는 string 타입이어서 호환되지 않음
   * Entity에서 enum으로 관리하면 될수도 있다.
   *
   * 그냥 쿼리 날리고싶은데 포맷을 맞춰야해서 Mapper와 ResponseDto를 쓴다.
   *
   * 아.. ApiProperty에서만 타입을 enum으로 해보자
   * 그리고 enum으로 명시하면 swagger에서는, 혹은 모듈화 패키지에서는 내부적으로 union으로 파싱되는듯
   */
  toResponse(model: AHJNotesModel): AhjNoteResponseDto {
    let type: AHJType = AHJType.STATE
    if (model.geoIdCounty) type = AHJType.COUNTY
    if (model.geoIdCountySubdivision) type = AHJType.COUNTY_SUBDIVISIONS
    if (model.geoIdPlace) type = AHJType.PLACE

    const response = new AhjNoteResponseDto()
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

  toListResponse(model: AHJNotesModel): AhjNoteListResponseDto {
    const response = new AhjNoteListResponseDto()
    response.geoId = model.geoId
    response.name = model.name
    response.fullAhjName = model.fullAhjName
    response.updatedBy = model.updatedBy
    response.updatedAt = model.updatedAt?.toISOString() || null
    return response
  }

  toHistoryListResponse(model: AHJNoteHistoryModel): AhjNoteHistoryListResponseDto {
    const response = new AhjNoteHistoryListResponseDto()
    response.id = model.id
    response.geoId = model.geoId
    response.name = model.name
    response.fullAhjName = model.fullAhjName
    response.updatedBy = model.updatedBy
    response.updatedAt = model.updatedAt?.toISOString() || null
    return response
  }
}
