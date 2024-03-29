import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { TenureRangeException, TotalPtoDaysRangeException } from '../../../pto/domain/pto.error'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { Type } from 'class-transformer'

export class JoinOrganizationRequestDto {
  @ApiProperty({ default: '2023-09-04' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly dateOfJoining?: Date | null
}

export class JoinOrganizationRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly organizationId: string
}
