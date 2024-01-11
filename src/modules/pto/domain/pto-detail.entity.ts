import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoDetailProps, PtoDetailProps } from './pto-detail.type'

export class PtoDetailEntity extends AggregateRoot<PtoDetailProps> {
  protected _id: string

  static create(create: CreatePtoDetailProps) {
    const id = v4()
    const props: PtoDetailProps = {
      ...create,
    }

    return new PtoDetailEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
