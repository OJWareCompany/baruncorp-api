import { OrderedServiceStatusEnum } from '../ordered-service.type'

export class ValidScopeStatus {
  private readonly validPreviouslyScopeStatus = [
    OrderedServiceStatusEnum.Completed,
    OrderedServiceStatusEnum.In_Progress,
    OrderedServiceStatusEnum.Not_Started,
  ]

  get value(): OrderedServiceStatusEnum[] {
    return this.validPreviouslyScopeStatus
  }
}
