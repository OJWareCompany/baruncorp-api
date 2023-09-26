import { Guard } from '../guard'
import { StringIsEmptyException } from '../exceptions/exceptions'

export const validateObjectEmptyStringFields = (props: any) => {
  Object.entries(props).map(([key, value]) => {
    if (typeof value !== 'string') return
    if (Guard.isEmpty(value)) throw new StringIsEmptyException(key)
  })
}
