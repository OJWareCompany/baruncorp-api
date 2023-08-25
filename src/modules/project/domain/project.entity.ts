import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateProjectProps, ProjectProps } from './project.type'
import { Address } from '../../organization/domain/value-objects/address.vo'

export class ProjectEntity extends AggregateRoot<ProjectProps> {
  protected _id: string

  static create(create: CreateProjectProps) {
    const id = v4()
    const props: ProjectProps = {
      ...create,
      totalOfJobs: 1,
      mailingAddressForWetStamp: null,
      systemSize: null,
      isGroundMount: null,
      numberOfWetStamp: null,
      clientUserId: null,
      clientUserName: null,
    }
    return new ProjectEntity({ id, props })
  }

  increaseJobCount() {
    this.props.totalOfJobs++
    return this
  }

  updateSystemSize(systemSize: number) {
    this.props.systemSize = systemSize
    return this
  }

  updateMailingAddressForWetStamp(mailingAddressForWetStamp: string) {
    this.props.mailingAddressForWetStamp = mailingAddressForWetStamp
    return this
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
