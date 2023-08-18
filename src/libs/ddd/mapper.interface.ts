export interface Mapper<DomainEntity, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord
  toDomain(record: DbRecord, ...entity: any): DomainEntity
  toResponse(entity: DomainEntity, ...dtos: any): Response
}
