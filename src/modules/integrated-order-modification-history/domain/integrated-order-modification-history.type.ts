export enum OrderModificationHistoryOperationEnum {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}
export interface CreateIntegratedOrderModificationHistoryProps {
  jobId: string
  modifiedAt: Date
  modifiedBy: string
  entity: string
  entityId: string
  scopeOrTaskName: string | null
  attribute: string
  operation: OrderModificationHistoryOperationEnum
  afterValue: string | null
  beforeValue: string | null
}
export type IntegratedOrderModificationHistoryProps = CreateIntegratedOrderModificationHistoryProps
