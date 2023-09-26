import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class NewOrderedServices {
  serviceId: string
  description: string | null
  constructor(props: NewOrderedServices) {
    this.serviceId = props.serviceId
    this.description = props.description
  }
}

export class OrderedTask {
  @ApiProperty()
  id: string
  @ApiProperty()
  invoiceAmount: number | null
  @ApiProperty()
  isNewTask: boolean
  @ApiProperty()
  taskStatus: string
  @ApiProperty()
  taskName: string
  @ApiProperty()
  serviceId: string
  @ApiProperty()
  jobId: string
  @ApiProperty()
  projectId: string
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  assigneeName: string | null
  @ApiProperty()
  assigneeUserId: string | null
  @ApiProperty()
  description: string | null
  constructor(props: OrderedTask) {
    initialize(this, props)
  }
}

// interface OrderedTaskProps {
//   isNewTask?: boolean
//   isLocked?: boolean
//   taskStatus?: string
//   taskName?: string
//   taskId?: string
//   jobId?: string
//   projectId?: string
//   dateCreated?: Date
//   assignedTo?: string | null
//   description?: string | null
// }
