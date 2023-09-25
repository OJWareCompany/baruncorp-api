import { ApiProperty } from '@nestjs/swagger'

export class AssignedTaskValueObject {
  @ApiProperty()
  id: string
  @ApiProperty()
  taskName: string
  @ApiProperty()
  status: string
  @ApiProperty()
  assigneeId: string | null
  @ApiProperty()
  startedAt: Date | null
  @ApiProperty()
  doneAt: Date | null
}
