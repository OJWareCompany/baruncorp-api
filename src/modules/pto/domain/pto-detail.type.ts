export interface CreatePtoDetailProps {
  ptoId: string
  ptoTypeId: string
  amount: number
  days: number
  startedAt: Date
}

export interface PtoDetailProps extends CreatePtoDetailProps {
  isPaid?: boolean
  name?: string
  abbreviation?: string
}
