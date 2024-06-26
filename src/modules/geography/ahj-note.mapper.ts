import { Mapper } from '@libs/ddd/mapper.interface'
import { AHJNotesModel } from './database/geography.repository'
import { AHJType, AhjNoteResponseDto, SelectOption } from './dto/ahj-note.response.dto'
import { AhjNoteListResponseDto } from './dto/ahj-note.paginated.response.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
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

  toResponse(model: AHJNotesModel): AhjNoteResponseDto {
    let type: AHJType = AHJType.STATE
    if (model.geoIdCounty) type = AHJType.COUNTY
    if (model.geoIdCountySubdivision) type = AHJType.COUNTY_SUBDIVISIONS
    if (model.geoIdPlace) type = AHJType.PLACE

    const response = new AhjNoteResponseDto()
    response.general = {
      website: model.website,
      specificFormRequired: model.specificFormRequired,
      wetStampRequired: model.wetStampsRequired as SelectOption,
      electricalStampRequired: model.electricalStampRequired as SelectOption,
      structuralStampRequired: model.structuralStampRequired as SelectOption,
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
      digitalSignatureType: model.digitalSignatureType,
      wetStampSize: model.wetStampSize,
      windSpeedRiskCatFirst: model.windSpeedRiskCatFirst,
      windSpeedRiskCatSecond: model.windSpeedRiskCatSecond,
      snowLoadGround: model.snowLoadGround,
      snowLoadFlatRoof: model.snowLoadFlatRoof,
      ofWetStamps: model.ofWetStamps,
    }

    response.electricalEngineering = {
      electricalNotes: model.electricalNotes,
    }

    return {
      ...response,
    }
  }

  toListResponse(model: Pick<AHJNotesModel, keyof AhjNoteListResponseDto>): AhjNoteListResponseDto {
    const response = new AhjNoteListResponseDto()
    response.geoId = model.geoId
    response.name = model.name
    response.fullAhjName = model.fullAhjName
    response.updatedBy = model.updatedBy
    response.updatedAt = model.updatedAt.toISOString()
    response.type = model.type
    return response
  }
}
