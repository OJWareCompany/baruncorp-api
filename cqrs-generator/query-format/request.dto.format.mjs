import { toPascalCase } from '../util/string-convertor.mjs'

export function getQueryRequestDtoContent(folderName) {
  return `import { ApiProperty } from '@nestjs/swagger'
  import { IsString } from 'class-validator'
  
  export class ${toPascalCase(folderName)}RequestDto {
    @ApiProperty({default:""})
    @IsString()
    readonly id: string
  }`
}
