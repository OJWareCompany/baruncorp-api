import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface ClientNoteSnapshotProps {
  id: string
  updateUserId: string
  updateUserName: string
  type: string
  designNotes: string
  electricalEngineeringNotes: string
  structuralEngineeringNotes: string
  createdAt: Date
}

export class ClientNoteSnapshot extends ValueObject<ClientNoteSnapshotProps> {
  get id(): string {
    return this.props.id
  }

  get updateUserId(): string {
    return this.props.updateUserId
  }

  get updatedUserName(): string {
    return this.props.updateUserName
  }

  get type(): string {
    return this.props.type
  }

  get designNotes(): string {
    return this.props.designNotes
  }

  get electricalEngineeringNotes(): string {
    return this.props.electricalEngineeringNotes
  }

  get structuralEngineeringNotes(): string {
    return this.props.structuralEngineeringNotes
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  protected validate(props: ClientNoteSnapshotProps): void {
    return
  }
}
