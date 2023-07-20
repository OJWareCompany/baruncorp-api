import { AHJNotesModel } from '../database/geography.repository'

export type Type = 'STATE' | 'COUNTY' | 'COUNTY SUBDIVISIONS' | 'PLACE'

export type General = Pick<
  AHJNotesModel,
  | 'website'
  | 'specificFormRequired'
  | 'generalNotes'
  | 'buildingCodes'
  | 'name'
  | 'updatedAt'
  | 'createdAt'
  | 'updatedBy'
  | 'type'
>

export type Design = Pick<
  AHJNotesModel,
  | 'fireSetBack'
  | 'utilityNotes'
  | 'designNotes'
  | 'pvMeterRequired'
  | 'acDisconnectRequired'
  | 'centerFed120Percent'
  | 'deratedAmpacity'
>

export type Engineering = Pick<
  AHJNotesModel,
  | 'engineeringNotes'
  | 'iebcAccepted'
  | 'structuralObservationRequired'
  | 'windUpliftCalculationRequired'
  | 'wetStampsRequired'
  | 'digitalSignatureType'
  | 'windExposure'
  | 'wetStampSize'
  | 'windSpeed'
  | 'snowLoadGround'
  | 'snowLoadFlatRoof'
  | 'snowLoadSlopedRoof'
  | 'ofWetStamps'
>

export type ElectricalEngineering = Pick<AHJNotesModel, 'electricalNotes'>

export type Additional = Pick<
  AHJNotesModel,
  | 'funcStat'
  | 'address'
  | 'fullAhjName'
  | 'lsadCode'
  | 'usps'
  | 'ansiCode'
  | 'geoId'
  | 'geoIdState'
  | 'geoIdCounty'
  | 'geoIdCountySubdivision'
  | 'geoIdPlace'
>
