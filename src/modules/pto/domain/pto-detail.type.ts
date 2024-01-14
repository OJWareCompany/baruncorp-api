import { Entity } from '@src/libs/ddd/entity.base'
import { PtoEntity } from './pto.entity'

export interface CreatePtoDetailProps {
  ptoId: string
  ptoTypeId: string
  amount: number
  days: number
  startedAt: Date
}

export interface PtoDetailProps extends CreatePtoDetailProps {
  isPaid: boolean
  name: string
  abbreviation: string
  ownerUserId: string
  ownerUserDateOfJoining: Date | null
  parentPtoEntity: PtoEntity | null
}
