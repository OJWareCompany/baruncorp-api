import { Paginated } from '../../../libs/ddd/repository.port'
import { VendorInvoiceEntity } from '../domain/vendor-invoice.entity'

export interface VendorInvoiceRepositoryPort {
  insert(entity: VendorInvoiceEntity): Promise<void>
  update(entity: VendorInvoiceEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<VendorInvoiceEntity | null>
  find(): Promise<Paginated<VendorInvoiceEntity>>
}
