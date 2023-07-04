import { v4 } from 'uuid'
import { CreateDepartmentProps, DepartmentProps } from '../interfaces/department.interface'

export class DepartmentEntity implements DepartmentProps {
  id: string
  name: string
  description: string

  static create(create: CreateDepartmentProps) {
    const id = v4()
    const props: DepartmentProps = { ...create }
    return new DepartmentEntity({ id, props })
  }

  constructor({ id, props }: { id: string; props: CreateDepartmentProps }) {
    this.id = id
    this.name = props.name
    this.description = props.description
  }
}
