import { ConfigModule } from '@nestjs/config'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { OrganizationCreatedDomainEvent } from './events/organization-created.domain-event'
import { CreateOrganizationProps, OrganizationProps } from './organization.types'
import { v4 } from 'uuid'

ConfigModule.forRoot()
const { APP_MODE } = process.env

export class OrganizationEntity extends AggregateRoot<OrganizationProps> {
  protected _id: string

  static create(create: CreateOrganizationProps) {
    const id = v4()
    const props: OrganizationProps = {
      ...create,
      organizationType: 'client',
      isDelinquent: false,
      isTierDiscount: false,
    }

    return new OrganizationEntity({ id, props })
  }

  get name() {
    return this.props.name
  }

  get numberOfFreeRevisionCount() {
    return this.props.numberOfFreeRevisionCount
  }

  get isSpecialRevisionPricing() {
    return this.props.isSpecialRevisionPricing
  }

  get invoiceRecipientEmail(): string {
    if (!this.props.invoiceRecipientEmail) throw new Error('No Invoice Recipient Email')
    return APP_MODE === 'production' ? this.props.invoiceRecipientEmail : this.getDevInvoiceRecipientEmail()
  }

  private getDevInvoiceRecipientEmail(): string {
    const isDevEmail = !!this.props.invoiceRecipientEmail?.endsWith('oj.vision')
    if (!!isDevEmail && this.props.invoiceRecipientEmail) {
      return this.props.invoiceRecipientEmail
    }
    return 'hyomin@oj.vision'
  }

  update(data: {
    invoiceRecipientEmail: string | null
    isVendor: boolean
    isDelinquent: boolean
    phoneNumber: string | null
    address: {
      street1: string
      street2: string | null
      city: string
      state: string
      postalCode: string
      country: string | null
      fullAddress: string
      coordinates: number[]
    }
    projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null
    mountingTypeDefaultValue: MountingTypeEnum | null
    isSpecialRevisionPricing: boolean
    numberOfFreeRevisionCount: number | null
  }) {
    this.props.invoiceRecipientEmail = data.invoiceRecipientEmail
    this.props.isVendor = data.isVendor
    this.props.isDelinquent = data.isDelinquent
    this.props.phoneNumber = data.phoneNumber
    this.props.address = data.address
    this.props.projectPropertyTypeDefaultValue = data.projectPropertyTypeDefaultValue
    this.props.mountingTypeDefaultValue = data.mountingTypeDefaultValue
    this.props.isSpecialRevisionPricing = data.isSpecialRevisionPricing
    this.props.numberOfFreeRevisionCount = data.numberOfFreeRevisionCount
  }

  public setCreateClientNoteEvent(userId: string) {
    this.addEvent(
      new OrganizationCreatedDomainEvent({
        aggregateId: this.id,
        userId: userId,
      }),
    )
  }

  setTierDiscount() {
    this.props.isTierDiscount = true
    return this
  }

  unsetTierDiscount() {
    this.props.isTierDiscount = false
    return this
  }

  public validate(): void {
    return
  }
}
