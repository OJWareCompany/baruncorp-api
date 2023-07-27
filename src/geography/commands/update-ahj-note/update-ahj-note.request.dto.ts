import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Design, ElectricalEngineering, Engineering, SelectOption } from '../../../geography/dto/ahj-note.response.dto'

/**
 * DTO에서만 Enum?
 * TODO: enum이 필요한지 확신이 없음. 근데 swagger때문에 써야함!
 */

class UpdateAhjGeneral {
  @ApiProperty({ example: 'https://google.com' })
  website: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  specificFormRequired: string

  @ApiProperty({ example: 'generalNotes...' })
  generalNotes: string

  @ApiProperty({ example: 'buildingCodes...' })
  buildingCodes: string
}

export class UpdateAhjNoteRequestDto {
  @IsOptional()
  general: UpdateAhjGeneral
  @IsOptional()
  design: Design
  @IsOptional()
  engineering: Engineering
  @IsOptional()
  electricalEngineering: ElectricalEngineering
}

/**
 * Design 클래스가 queries와 commands에서 함께 사용된다.
 * 각각 따로 만드는 것이 좋은가?
 * 근데 command에서 value object를 사용하니까.. domain폴더에 ahj types파일로 둬서 여기저기서 사용하게 해도 될것같다. 일단은
 * 적어도 서비스에서 쓸 업데이트용 dto 클래스는!
 */
