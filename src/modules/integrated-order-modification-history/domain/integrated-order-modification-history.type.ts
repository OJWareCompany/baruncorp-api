export enum OrderModificationHistoryOperationEnum {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}
export interface CreateIntegratedOrderModificationHistoryProps {
  name: string
}
export type IntegratedOrderModificationHistoryProps = CreateIntegratedOrderModificationHistoryProps
