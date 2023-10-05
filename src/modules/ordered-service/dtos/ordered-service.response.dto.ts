import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { OrderedServiceStatusEnum } from '../domain/ordered-service.type'

export class OrderedServiceAssignedTaskResopnse {
  @ApiProperty()
  id: string
  @ApiProperty()
  taskName: string
  @ApiProperty()
  status: string
  @ApiProperty()
  assigneeId: string | null
  @ApiProperty()
  startedAt: string | null
  @ApiProperty()
  doneAt: string | null
}

export class OrderedServiceResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  serviceId: string

  @ApiProperty({ type: Number, nullable: true })
  price: number | null

  @ApiProperty()
  jobId: string

  @ApiProperty({ default: OrderedServiceStatusEnum.Completed, enum: OrderedServiceStatusEnum, nullable: true })
  status: OrderedServiceStatusEnum | null

  @ApiProperty({ nullable: true })
  orderedAt: string | null

  @ApiProperty({ nullable: true })
  doneAt: string | null

  @ApiProperty()
  isRevision: boolean

  @ApiProperty()
  assignedTasks: OrderedServiceAssignedTaskResopnse[]

  constructor(props: OrderedServiceResponseDto) {
    initialize(this, props)
  }
}
