import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateProjectProps, MountingType, ProjectProps, ProjectUpdateProps } from './project.type'
import { NewOrderedTasks } from '@src/modules/ordered-job/domain/value-objects/ordered-task.value-object'

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
      mountingType: null,
      hasHistoryElectricalPEStamp: false,
      hasHistoryStructuralPEStamp: false,
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

  updateHasTaskHistory(orderedTasks: NewOrderedTasks[]) {
    if (orderedTasks.map((task) => task.taskId).includes('5c29f1ae-d50b-4400-a6fb-b1a2c87126e9')) {
      this.props.hasHistoryElectricalPEStamp = true
    }
    if (orderedTasks.map((task) => task.taskId).includes('99ff64ee-fe47-4235-a026-db197628d077')) {
      this.props.hasHistoryStructuralPEStamp = true
    }
    return this
  }

  update(props: ProjectUpdateProps) {
    this.props.projectPropertyType = props.projectPropertyType
    this.props.projectPropertyOwner = props.projectPropertyOwner
    this.props.projectNumber = props.projectNumber
    this.props.projectPropertyAddress = props.projectPropertyAddress
    this.props.projectAssociatedRegulatory = props.projectAssociatedRegulatory
    this.props.updatedBy = props.updatedBy
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
