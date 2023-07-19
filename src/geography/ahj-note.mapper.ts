import { AHJNotes } from '@prisma/client'
import { Mapper } from '../department/license.mapper'
import { AHJNotesModel } from './database/geography.repository'
import { Design, ElectricalEngineering, Engineering, General, Type } from './types/notes.type'

export class AhjNoteResponseDto {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export class AhjNoteMapper implements Mapper<any, AHJNotesModel, AhjNoteResponseDto> {
  toPersistence(entity: any): AHJNotes {
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
    let type: Type = 'STATE'
    if (model.geoIdCounty) type = 'COUNTY'
    if (model.geoIdCountySubdivision) type = 'COUNTY SUBDIVISIONS'
    if (model.geoIdPlace) type = 'PLACE'

    const response = new AhjNoteResponseDto()
    response.general = {
      website: model.website,
      specificFormRequired: model.specificFormRequired,
      generalNotes: model.generalNotes,
      buildingCodes: model.buildingCodes,
      name: model.name,
      modifiedBy: model.modifiedBy,
      createdAt: model.createdAt,
      modifiedAt: model.modifiedAt,
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
      snowLoadSlopedRoof: model.snowLoadSlopedRoof,
      ofWetStamps: model.ofWetStamps,
    }

    response.electricalEngineering = {
      electricalNotes: model.electricalNotes,
    }

    return response
  }
}
