import { toPascalCase } from '../util/string-convertor.mjs'

export function getPaginatedQueryResponseDtoContent(folderName, domainName) {
  const pascalDomain = `${toPascalCase(domainName)}`
  return `import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../../libs/utils/constructor-initializer'

import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ${pascalDomain}ResponseDto } from './${domainName}.response.dto'

export class ${pascalDomain}PaginatedResponseDto extends PaginatedResponseDto<${pascalDomain}ResponseDto> {
  @ApiProperty({ type: ${pascalDomain}ResponseDto, isArray: true })
  items: readonly ${pascalDomain}ResponseDto[]
}

`
}
