import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface LineItemVOProps {
  orderedServices: []
}

export class LineItemVO extends ValueObject<LineItemVOProps> {
  protected validate(props: LineItemVOProps): void {
    return
  }
}
