import { PtoDetail } from './value-objects/pto.detail.vo'

export interface CreatePtoProps {
  userId: string
  tenure: number
  total: number
  isPaid: boolean
}

export interface PtoProps extends CreatePtoProps {
  details: PtoDetail[]
}
