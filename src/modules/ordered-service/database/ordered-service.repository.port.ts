import { OrderedServices } from '@prisma/client'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { UserEntity } from '../../users/domain/user.entity'

/**
 * 원칙상 Repository Port(인터페이스)는 Domain 모듈의 파일이다.
 * 따라서 도메인 이외의 구현체에 대해서는 알수 없어야한다.
 * Prisma도 구현체이므로 원래는 인터페이스에 있으면 안된다.
 *
 * References
 * - https://www.youtube.com/watch?v=7oW3fnsMHPs&t=398s
 */

export interface OrderedServiceRepositoryPort {
  insert(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  findOne(id: string): Promise<OrderedServiceEntity | null>
  findOneOrThrow(id: string): Promise<OrderedServiceEntity>
  find(ids: string[]): Promise<OrderedServiceEntity[] | null>
  findBy(
    propertyName: keyof OrderedServices,
    values: OrderedServices[typeof propertyName][],
  ): Promise<OrderedServiceEntity[]>
  update(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  delete(id: string): Promise<void>
  getPreviouslyOrderedServices(projectId: string, serviceId: string): Promise<OrderedServiceEntity[]>
  rollbackUpdatedAtAndEditor(orderedScope: OrderedServiceEntity): Promise<void>
  updateOnlyEditorInfo(entity: OrderedServiceEntity, editor?: UserEntity): Promise<void>
}
