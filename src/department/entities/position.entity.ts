import { v4 } from 'uuid'
import { CreatePositionProps, PositionProps } from '../interfaces/position.interface'

export class PositionEntity {
  id?: string
  protected readonly props: PositionProps

  static create(create: CreatePositionProps) {
    const id = v4()
    const props: PositionProps = { ...create }
    return new PositionEntity({ id, props })
  }

  constructor({ id, props }: { id: string; props: CreatePositionProps }) {
    this.id = id
    this.props = props
  }

  getProps(): PositionProps & { id: string } {
    const propsCopy = {
      id: this.id,
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }
}
