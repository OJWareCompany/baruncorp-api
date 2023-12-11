import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { CreateServiceRequestDto } from '../create-service/create-service.request.dto'

export class UpdateServiceRequestDtoParam {
  @ApiProperty()
  @IsString()
  readonly serviceId: string
}

export class UpdateServiceRequestDto extends CreateServiceRequestDto {}
