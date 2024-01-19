import { PtoDetailEntity } from './pto-detail.entity'
import { PtoDetail } from './value-objects/pto.detail.vo'
import { PtoTargetUser } from './value-objects/target.user.vo'

export interface CreatePtoProps {
  userId: string
  tenure: number
  total: number
  isPaid: boolean
  startedAt: Date
  endedAt: Date
  dateOfJoining: Date
}

export interface PtoProps extends CreatePtoProps {
  targetUser: PtoTargetUser | null
  details: PtoDetail[]
}
