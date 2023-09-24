import { toCamelCase } from '../util/toCamelCase.mjs'

export function getRequestDtoContent(folderName) {
  return `import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ${toCamelCase(folderName)}RequestDto {
  @ApiProperty({default:""})
  @IsString()
  readonly id: string
}`
}
