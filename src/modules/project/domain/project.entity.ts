import { CreateProjectProps, ProjectProps } from './project.type'
import { v4 } from 'uuid'

export class ProjectEntity {
  id: string
  protected readonly props: ProjectProps

  static create(create: CreateProjectProps) {
    const id = v4()
    return new ProjectEntity({ id, props: create })
  }

  constructor({ id, props }: { id: string; props: CreateProjectProps }) {
    this.id = id
    this.props = props
  }

  getProps(): ProjectProps & { id: string } {
    const copyProps = {
      id: this.id,
      ...this.props,
    }
    return Object.freeze(copyProps)
  }
}
