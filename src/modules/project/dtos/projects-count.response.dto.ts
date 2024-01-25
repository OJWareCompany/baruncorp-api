import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class ProjectsCountResponseDto {
  @ApiProperty()
  @IsNumber()
  projectsCount: number

  @ApiProperty()
  @IsNumber()
  jobsCount: number
}
