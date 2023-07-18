export type Type = 'STATE' | 'COUNTY' | 'COUNTY SUBDIVISIONS' | 'PLACE'

export type General = {
  website?: string
  specificFormRequired?: string
  generalNotes?: string
  buildingCodes?: string
  name?: string
  modifiedBy?: string
  createdAt?: string
  modifiedAt?: string
  type?: Type
}

export type Design = {
  fireSetBack?: string
  utilityNotes?: string
  designNotes?: string
  PVMeterRequired?: string
  ACDisconnectRequired?: string
  centerFed120Percent?: string
  deratedAmpacity?: string
}

export type Engineering = {
  engineeringNotes?: string
  iEBCAccepted?: string
  structuralObservationRequired?: string
  windUpliftCalculationRequired?: string
  wetStampsRequired?: string
  digitalSignatureType?: string
  windExposure?: string
  wetStampSize?: string
  windSpeed?: string
  snowLoadGround?: string
  snowLoadFlatRoof?: string
  snowLoadSlopedRoof?: string
  ofWetStamps?: string
}

export type ElectricalEngineering = {
  electricalNotes?: string
}

export type Additional = {
  FUNCSTAT: string
  address: string
  fullAHJName: string
  LSAD: string
  USPS: string
  ansiCode: string
  geoId: string
  geoIdState: string
  geoIdCounty: string
  geoIdCountySubdivision: string
  geoIdPlace: string
}
