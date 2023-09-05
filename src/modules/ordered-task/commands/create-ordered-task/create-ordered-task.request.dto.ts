import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateOrderedTaskRequestDto {
  @ApiProperty({ default: 'e5d81943-3fef-416d-a85b-addb8be296c0' })
  @IsString()
  taskMenuId: string

  @ApiProperty({ default: 'f64d7b09-e51c-4dcb-bb8e-810f66e0cacf' })
  @IsString()
  jobId: string

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  assignedUserId: string | null

  @ApiProperty({ default: 'added task' })
  @IsString()
  description: string | null
}
