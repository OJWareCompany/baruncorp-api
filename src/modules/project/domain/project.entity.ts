import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateProjectProps, ProjectProps } from './project.type'

export class ProjectEntity extends AggregateRoot<ProjectProps> {
  protected _id: string

  static create(create: CreateProjectProps) {
    const id = v4()
    const props: ProjectProps = {
      ...create,
      mailingAddressForWetStamp: null,
      systemSize: null,
      isGroundMount: null,
      numberOfWetStamp: null,
      clientUserId: null,
      clientUserName: null,
    }
    return new ProjectEntity({ id, props })
  }

  public validate(): void {
    throw new Error('Method not implemented.')
  }
}
