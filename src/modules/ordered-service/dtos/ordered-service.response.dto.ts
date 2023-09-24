import { ApiProperty } from '@nestjs/swagger'
import { OrderedServiceStatusEnum } from '../domain/ordered-service.type'

export class OrderedServiceResponse {
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

  @ApiProperty({ isArray: true })
  assignedTasks: []
}
