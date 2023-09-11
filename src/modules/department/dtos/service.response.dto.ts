import { ApiProperty } from '@nestjs/swagger'

export class ServiceResponseDto {
  @ApiProperty({ default: '9e773832-ad39-401d-b1c2-16d74f9268ea' })
  id: string

  @ApiProperty({ default: 'Structural Calculation' })
  name: string

  @ApiProperty({ default: 'Structural Calculation is service...' })
  description: string | null

  @ApiProperty({ default: true })
  isOrderable: boolean

  @ApiProperty({ default: ServiceResponseDto, type: ServiceResponseDto, isArray: true })
  childTasks: ServiceResponseDto[]
}
