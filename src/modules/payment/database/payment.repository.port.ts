import { Paginated } from '../../../libs/ddd/repository.port'
import { PaymentEntity } from '../domain/payment.entity'

export interface PaymentRepositoryPort {
  insert(entity: PaymentEntity): Promise<void>
  update(entity: PaymentEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PaymentEntity | null>
  findByInvoiceId(invoiceId: string): Promise<PaymentEntity[]>
}
