import { AHJNoteHistory } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { AhjNoteHistoryListResponseDto } from './dto/ahj-note-history.paginated.response.dto'
import { AhjNoteHistoryResponseDto } from './dto/ahj-note-history.response.dto'
import { AhjNoteHistoryTypeEnum } from './domain/ahj-job-note.type'
import { AHJNoteHistoryModel } from './database/geography.repository'
import { AHJType, SelectOption } from './dto/ahj-note.response.dto'

@Injectable()
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

  toResponse(model: AHJNoteHistoryModel, beforeHistory?: AHJNoteHistoryModel | null): AhjNoteHistoryResponseDto {
    let type: AHJType = AHJType.STATE
    if (model.geoIdCounty) type = AHJType.COUNTY
    if (model.geoIdCountySubdivision) type = AHJType.COUNTY_SUBDIVISIONS
    if (model.geoIdPlace) type = AHJType.PLACE

    const response = new AhjNoteHistoryResponseDto()

    response.historyType = model.history_type as AhjNoteHistoryTypeEnum

    response.general = {
      website: model.website,
      specificFormRequired: model.specificFormRequired,
      generalNotes: model.generalNotes,
      wetStampRequired: model.wetStampsRequired as SelectOption | null,
      electricalStampRequired: model.electricalStampRequired as SelectOption | null,
      structuralStampRequired: model.structuralStampRequired as SelectOption | null,
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

    if (beforeHistory) {
      response.beforeModification = this.toResponse(beforeHistory)
    }
    return {
      ...response,
    }
  }

  toListResponse(model: AHJNoteHistory): AhjNoteHistoryListResponseDto {
    const response = new AhjNoteHistoryListResponseDto()
    response.geoId = model.geoId
    response.historyType = model.history_type as AhjNoteHistoryTypeEnum
    response.name = model.name
    response.fullAhjName = model.fullAhjName
    response.updatedBy = model.updatedBy
    response.updatedAt = model.updatedAt.toISOString()
    return response
  }
}
