import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateInformationProps, InformationProps } from './information.type'

export class InformationEntity extends AggregateRoot<InformationProps> {
  protected _id: string

  static create(create: CreateInformationProps) {
    const id = v4()
    const props: InformationProps = {
      ...create,
    }

    return new InformationEntity({ id, props })
  }

  get contents(): JSON[] {
    return this.props.contents
  }

  set contents(contents: JSON[]) {
    this.props.contents = contents
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive
  }

  public validate(): void {
    return
  }
}
