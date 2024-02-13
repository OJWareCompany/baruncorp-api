import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { NewOrderedServices } from '../../ordered-job/domain/value-objects/assigned-task.value-object'
import { Address } from '../../organization/domain/value-objects/address.vo'
import {
  CreateProjectProps,
  MountingType,
  ProjectPropertyTypeEnum,
  ProjectProps,
  UpdateProjectProps,
  UpdatePropertyAddressProps,
} from './project.type'
import { ProjectAssociatedRegulatoryBody } from './value-objects/project-associated-regulatory-body.value-object'
import { ProjectPropertyAddressUpdatedDomainEvent } from './events/project-property-address-updated.domain-event'
import { SystemSizeBadRequestException } from '../../ordered-job/domain/job.error'

export class ProjectEntity extends AggregateRoot<ProjectProps> {
  protected _id: string

  static create(create: CreateProjectProps) {
    const id = v4()
    const props: ProjectProps = {
      ...create,
      totalOfJobs: 0,
      mailingFullAddressForWetStamp: null,
      systemSize: null,
      numberOfWetStamp: null,
      mountingType: null,
      hasHistoryElectricalPEStamp: false,
      hasHistoryStructuralPEStamp: false,
    }
    return new ProjectEntity({ id, props })
  }

  get totalOfJobs(): number {
    return this.props.totalOfJobs
  }

  get projectPropertyAddress(): Address {
    return this.props.projectPropertyAddress
  }

  get clientOrganizationId() {
    return this.props.clientOrganizationId
  }

  get projectPropertyType() {
    return this.props.projectPropertyType
  }

  get projectPropertyOwnerName() {
    return this.props.projectPropertyOwner
  }

  get projectNumber() {
    return this.props.projectNumber
  }

  get isResidential(): boolean {
    return this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential
  }

  get isCommercial(): boolean {
    return this.props.projectPropertyType === ProjectPropertyTypeEnum.Commercial
  }

  setTotalOfJobs(totalOfJobs: number) {
    this.props.totalOfJobs = totalOfJobs
    return this
  }

  setSystemSize(systemSize: number | null) {
    if (!systemSize) return this
    if (systemSize && 99999999.99999999 < systemSize) throw new SystemSizeBadRequestException()
    this.props.systemSize = systemSize
    return this
  }

  setMailingFullAddressForWetStamp(mailingFullAddressForWetStamp: string | null) {
    if (!mailingFullAddressForWetStamp) return this
    this.props.mailingFullAddressForWetStamp = mailingFullAddressForWetStamp
    return this
  }

  setMountingType(mountingType: MountingType) {
    this.props.mountingType = mountingType
    return this
  }

  updateHasTaskHistory(orderedTasks: NewOrderedServices[]) {
    if (orderedTasks.map((task) => task.serviceId).includes('5c29f1ae-d50b-4400-a6fb-b1a2c87126e9')) {
      this.props.hasHistoryElectricalPEStamp = true
    }
    if (orderedTasks.map((task) => task.serviceId).includes('99ff64ee-fe47-4235-a026-db197628d077')) {
      this.props.hasHistoryStructuralPEStamp = true
    }
    return this
  }

  updatePropertyAddress(updatePropertyAddressProps: UpdatePropertyAddressProps) {
    const { projectPropertyAddress, projectAssociatedRegulatory } = updatePropertyAddressProps
    this.props.projectPropertyAddress = new Address({
      ...projectPropertyAddress,
    })

    this.props.projectAssociatedRegulatory = new ProjectAssociatedRegulatoryBody({
      stateId: projectAssociatedRegulatory.stateId, // 무조건 결과값 받아온다고 가정
      countyId: projectAssociatedRegulatory.countyId,
      countySubdivisionsId: projectAssociatedRegulatory.countySubdivisionsId,
      placeId: projectAssociatedRegulatory.placeId,
    })
    this.addEvent(
      new ProjectPropertyAddressUpdatedDomainEvent({
        aggregateId: this.id,
        projectPropertyAddress: this.props.projectPropertyAddress,
      }),
    )
  }

  update(props: UpdateProjectProps) {
    this.props.projectPropertyType = props.projectPropertyType
    this.props.projectPropertyOwner = props.projectPropertyOwner
    this.props.projectNumber = props.projectNumber
    this.props.updatedBy = props.updatedBy
    this.props.utilityId = props.utilityId
  }

  deepEqualsPropertyAddressCoordinates(coordinates: number[]): boolean {
    const currentCoordinates = this.projectPropertyAddress.coordinates
    return currentCoordinates[0] === coordinates[0] && currentCoordinates[1] === coordinates[1]
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
