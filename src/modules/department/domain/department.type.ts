export interface CreateDepartmentProps {
  name: string
  description: string | null
  viewClientInvoice: boolean
  viewVendorInvoice: boolean
  viewCustomPricing: boolean
  viewExpensePricing: boolean
  viewScopePrice: boolean
  viewTaskCost: boolean
  editUserTask: boolean
  editUserLicense: boolean
  editUserPosition: boolean
}
export type DepartmentProps = CreateDepartmentProps
