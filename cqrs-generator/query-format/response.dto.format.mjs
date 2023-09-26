import { toPascalCase } from '../util/string-convertor.mjs'

export function getQueryResponseDtoContent(folderName, domainName) {
  return `import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

/**
 * Remove interface after select fields
 */
export class ${toPascalCase(domainName)}ResponseDto implements ${toPascalCase(domainName)}s {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  constructor(props: ${toPascalCase(domainName)}ResponseDto) {
    initialize(this, props)
  }
}
`
}
