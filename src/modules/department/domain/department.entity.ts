import { v4 } from 'uuid'
import { CreateDepartmentProps, DepartmentProps } from './department.types'

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

/**
 * service, position이 과연 엔티티인가
 * 일단 user-license, user-position은.. 각각에대한 fk만 가지고있기때문에 position이나 project나 변화가 있을때 아무런 관련이 없고
 * 오히려 유저가 등록되었을때나 업데이트되었을때 영향이 간다.
 * 그러니까 project 보다 user aggregate에 있는게 적합한 것 같다.
 */
