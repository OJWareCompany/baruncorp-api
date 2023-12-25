import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateTaskProps, TaskProps } from './task.type'
import { Guard } from '../../../libs/guard'
import { StringIsEmptyException } from '../../../libs/exceptions/exceptions'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'

export class TaskEntity extends AggregateRoot<TaskProps> {
  protected _id: string

  static create(create: CreateTaskProps) {
    const id = v4()
    const props: TaskProps = { ...create }
    return new TaskEntity({ id, props })
  }

  setName(name: string): this {
    if (Guard.isEmpty(name)) throw new StringIsEmptyException('name')
    this.props.name = name
    return this
  }

  setLicenseRequired(licenseRequired: LicenseTypeEnum | null) {
    this.props.licenseType = licenseRequired
    return this
  }

  public validate(): void {
    Object.entries(this.props).map(([key, value]) => {
      if (typeof value !== 'string') return
      if (Guard.isEmpty(value)) throw new StringIsEmptyException(key)
    })
  }
}
