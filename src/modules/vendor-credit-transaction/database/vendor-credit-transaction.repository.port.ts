import { VendorCreditTransactionEntity } from '../domain/vendor-credit-transaction.entity'

export interface VendorCreditTransactionRepositoryPort {
  insert(entity: VendorCreditTransactionEntity): Promise<void>
  update(entity: VendorCreditTransactionEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<VendorCreditTransactionEntity | null>
  findOneOrThrow(id: string): Promise<VendorCreditTransactionEntity>
  find(vendorOrganizationId: string): Promise<VendorCreditTransactionEntity[]>
}
