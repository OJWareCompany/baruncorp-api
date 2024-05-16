import {
  AutoOnlyOrderedServiceStatusEnum,
  OrderedScopeStatus,
  OrderedServiceStatusEnum,
} from '../../../ordered-service/domain/ordered-service.type'

export class NotStartedRequiredOrderedServiceStatuses {
  private readonly _value = [
    OrderedServiceStatusEnum.Canceled,
    OrderedServiceStatusEnum.Canceled_Invoice,
    OrderedServiceStatusEnum.Not_Started,
    AutoOnlyOrderedServiceStatusEnum.On_Hold,
  ]

  get value(): OrderedScopeStatus[] {
    return this._value
  }
}
