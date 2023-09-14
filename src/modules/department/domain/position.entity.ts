import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { v4 } from 'uuid'

export interface PositionProps {
  name: string
  departmentId: string
  departmentName: string
  description: string | null
}

export interface CreatePositionProps extends PositionProps {
  departmentId: string
}

export interface UpdatePositionProps extends PositionProps {
  departmentId: string
}

export interface DeletePositionProps {
  positionId: string
}

export class PositionEntity extends AggregateRoot<PositionProps> {
  protected _id: string

  static create(create: CreatePositionProps) {
    const id = v4()
    const props: PositionProps = { ...create }
    return new PositionEntity({ id, props })
  }

  public validate(): void {
    const result = 1
  }
}
