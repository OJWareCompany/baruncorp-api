import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateIntegratedOrderModificationHistoryProps,
  IntegratedOrderModificationHistoryProps,
} from './integrated-order-modification-history.type'

export class IntegratedOrderModificationHistoryEntity extends AggregateRoot<IntegratedOrderModificationHistoryProps> {
  protected _id: string

  static create(create: CreateIntegratedOrderModificationHistoryProps) {
    const id = v4()
    const props: IntegratedOrderModificationHistoryProps = { ...create }
    return new IntegratedOrderModificationHistoryEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
