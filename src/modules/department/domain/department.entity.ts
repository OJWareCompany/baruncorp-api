import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateDepartmentProps, DepartmentProps } from './department.type'

export class DepartmentEntity extends AggregateRoot<DepartmentProps> {
  protected _id: string

  static create(create: CreateDepartmentProps) {
    const id = v4()
    const props: DepartmentProps = { ...create }
    return new DepartmentEntity({ id, props })
  }

  setName(name: string) {
    this.props.name = name
  }

  setDescription(description: string | null) {
    this.props.description = description
  }

  public validate(): void {
    return
  }
}
