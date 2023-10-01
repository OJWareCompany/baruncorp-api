import { Paginated } from '../../../libs/ddd/repository.port'
import { InvoiceEntity } from '../domain/invoice.entity'

export interface InvoiceRepositoryPort {
  insert(entity: InvoiceEntity): Promise<void>
  update(entity: InvoiceEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<InvoiceEntity | null>
  find(): Promise<Paginated<InvoiceEntity>>
}
