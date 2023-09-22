import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { v4 } from 'uuid'
import { CreateServiceProps, ServiceProps } from './service/service.type'

export class ServiceEntity extends AggregateRoot<ServiceProps> {
  protected _id: string

  static create(create: CreateServiceProps) {
    const id = v4()
    const props: ServiceProps = { ...create }
    const entity = new ServiceEntity({ id, props })
    return entity
  }

  public validate(): void {
    return
  }
}
