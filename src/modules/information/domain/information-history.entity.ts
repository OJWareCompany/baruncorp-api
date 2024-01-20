import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateInformationHistoryProps,
  CreateInformationProps,
  InformationHistoryProps,
  InformationProps,
} from './information.type'

export class InformationHistoryEntity extends AggregateRoot<InformationHistoryProps> {
  protected _id: string

  static create(create: CreateInformationHistoryProps) {
    const id = v4()
    const props: InformationHistoryProps = {
      ...create,
    }

    return new InformationHistoryEntity({ id, props })
  }

  get contents(): JSON[] {
    return this.props.contents
  }

  set contents(contents: JSON[]) {
    this.props.contents = contents
  }

  get updatedBy(): string {
    return this.props.updatedBy
  }

  set updatedBy(updatedBy: string) {
    this.props.updatedBy = updatedBy
  }

  public validate(): void {
    return
  }
}
