export interface CreatePtoDetailProps {
  ptoId: string
  ptoTypeId: string
  value: number
  startedAt: Date
  endedAt: Date
}

export interface PtoDetailProps extends CreatePtoDetailProps {
  name?: string
  abbreviation?: string
}
