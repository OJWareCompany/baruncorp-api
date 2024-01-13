import { PtoDetailEntity } from './pto-detail.entity'
import { PtoDetail } from './value-objects/pto.detail.vo'

export interface CreatePtoProps {
  userId: string
  tenure: number
  total: number
  isPaid: boolean
}

export interface PtoProps extends CreatePtoProps {
  dateOfJoining?: Date | null
  details: PtoDetailEntity[] | null
}
