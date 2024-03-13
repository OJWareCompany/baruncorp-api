import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateDepartmentProps, DepartmentProps } from './department.type'

export class DepartmentEntity extends AggregateRoot<DepartmentProps> {
  protected _id: string

  static create(create: CreateDepartmentProps) {
    const id = v4()
    const props: DepartmentProps = { ...create }
    return new DepartmentEntity({ id, props })
  }

  setName(name: string): this {
    this.props.name = name
    return this
  }

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  setViewClientInvoice(viewClientInvoice: boolean): this {
    this.props.viewClientInvoice = viewClientInvoice
    return this
  }

  setViewVendorInvoice(viewVendorInvoice: boolean): this {
    this.props.viewVendorInvoice = viewVendorInvoice
    return this
  }

  setViewCustomPricing(viewCustomPricing: boolean): this {
    this.props.viewCustomPricing = viewCustomPricing
    return this
  }

  setViewExpensePricing(viewExpensePricing: boolean): this {
    this.props.viewExpensePricing = viewExpensePricing
    return this
  }

  setViewScopePrice(viewScopePrice: boolean): this {
    this.props.viewScopePrice = viewScopePrice
    return this
  }

  setViewTaskCost(viewTaskCost: boolean): this {
    this.props.viewTaskCost = viewTaskCost
    return this
  }

  setEditUserTask(editUserTask: boolean): this {
    this.props.editUserTask = editUserTask
    return this
  }

  setEditUserLicense(editUserLicense: boolean): this {
    this.props.editUserLicense = editUserLicense
    return this
  }

  setEditUserPosition(editUserPosition: boolean): this {
    this.props.editUserPosition = editUserPosition
    return this
  }

  setSendDeliverables(sendDeliverables: boolean): this {
    this.props.sendDeliverables = sendDeliverables
    return this
  }
  setEditMemberRole(editMemberRole: boolean): this {
    this.props.editMemberRole = editMemberRole
    return this
  }

  setEditClientRole(editClientRole: boolean): this {
    this.props.editClientRole = editClientRole
    return this
  }

  public validate(): void {
    return
  }
}
