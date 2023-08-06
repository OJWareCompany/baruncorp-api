export interface Mapper<DomainEntity, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord
  toDomain(record: any, ...entity: any): DomainEntity
  toResponse(entity: DomainEntity, ...dtos: any): Response
}
