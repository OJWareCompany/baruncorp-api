import { toCamelCase, toPascalCase } from '../util/string-convertor.mjs'

export function getRequestParamDtoContent(folderName, domainName) {
  return `import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ${toPascalCase(folderName)}ParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly ${toCamelCase(domainName)}Id: string
}

export class ${toPascalCase(folderName)}RequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
`
}
