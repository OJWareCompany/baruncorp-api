import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { Design, ElectricalEngineering, Engineering, General } from '../dto/ahj-note.response.dto'
import { v4 } from 'uuid'

export interface CreateAhjNoteProps {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export interface AhjNoteProps {
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}

export class AhjNoteEntity extends AggregateRoot<AhjNoteProps> {
  protected _id: string

  static create(create: CreateAhjNoteProps) {
    const id = v4()
    const props: AhjNoteProps = { ...create }
    return new AhjNoteEntity({ id, props })
  }

  public validate(): void {
    const result = 1 + 1
  }
}
