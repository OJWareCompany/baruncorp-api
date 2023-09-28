import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { validateObjectEmptyStringFields } from '../../../../libs/utils/validate-object-empty-string-fields'

export interface OrganizationProps {
  id: string
  name: string
  organizationType: string
}

export class Organization extends ValueObject<OrganizationProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get organizationType(): string {
    return this.props.organizationType
  }

  protected validate(props: OrganizationProps): void {
    validateObjectEmptyStringFields(props)
  }
}
