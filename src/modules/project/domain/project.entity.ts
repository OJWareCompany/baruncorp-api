import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateProjectProps, MountingType, ProjectProps, ProjectUpdateProps } from './project.type'

export class ProjectEntity extends AggregateRoot<ProjectProps> {
  protected _id: string

  static create(create: CreateProjectProps) {
    const id = v4()
    const props: ProjectProps = {
      ...create,
      totalOfJobs: 1,
      mailingAddressForWetStamp: null,
      systemSize: null,
      numberOfWetStamp: null,
      clientUserId: null,
      clientUserName: null,
      mountingType: null,
    }
    return new ProjectEntity({ id, props })
  }

  updateTotalOfJobs(totalOfJobs: number) {
    this.props.totalOfJobs = totalOfJobs
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

  updateMountingType(mountingType: MountingType) {
    this.props.mountingType = mountingType
    return this
  }

  update(props: ProjectUpdateProps) {
    this.props.projectPropertyType = props.projectPropertyType
    this.props.projectPropertyOwner = props.projectPropertyOwner
    this.props.projectNumber = props.projectNumber
    this.props.projectPropertyAddress = props.projectPropertyAddress
    this.props.projectAssociatedRegulatory = props.projectAssociatedRegulatory
    this.props.updatedBy = props.updatedBy
    this.props.clientUserId = props.clientUserId
    this.props.clientUserName = props.clientUserName
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
