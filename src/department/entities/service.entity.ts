import { v4 } from 'uuid'

export interface ServiceProps {
  name: string
  description: string
}

export interface CreateServiceProps {
  name: string
  description: string
}

export class ServiceEntity {
  protected readonly id: string
  protected readonly props: ServiceProps

  static create(create: CreateServiceProps) {
    const id = v4()
    const props: ServiceProps = { ...create }
    return new ServiceEntity({ id, props })
  }

  constructor({ id, props }: { id: string; props: CreateServiceProps }) {
    this.id = id
    this.props = props
  }

  getProps() {
    const copyProps = {
      id: this.id,
      ...this.props,
    }
    return Object.freeze(copyProps)
  }
}
