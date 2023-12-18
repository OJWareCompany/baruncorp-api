import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { v4 } from 'uuid'

export interface CreatePositionProps {
  name: string
  description: string | null
  maxAssignedTasksLimit: number | null
}

export type PositionProps = CreatePositionProps

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
