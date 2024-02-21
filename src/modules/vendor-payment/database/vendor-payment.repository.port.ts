import { Paginated } from '../../../libs/ddd/repository.port'
import { VendorPaymentEntity } from '../domain/vendor-payment.entity'

export interface VendorPaymentRepositoryPort {
  insert(entity: VendorPaymentEntity): Promise<void>
  update(entity: VendorPaymentEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<VendorPaymentEntity | null>
  find(): Promise<Paginated<VendorPaymentEntity>>
  findByVendorInvoiceId(vendorInvoiceId: string): Promise<VendorPaymentEntity[]>
}
