import { PtoAvailableValues } from '@prisma/client'
import { PtoAvailableValue } from './value-objects/pto.available-value.vo'

export interface CreatePtoProps {
  name: string
}

export interface PtoProps extends CreatePtoProps {
  name: string
  availableValues: PtoAvailableValue[]
}
