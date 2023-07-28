import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindOrganizationRequestDto {
  @ApiProperty({ default: 'eaefe251-0f1f-49ac-88cb-3582ec76601d' })
  @IsString()
  organizationId: string
}
