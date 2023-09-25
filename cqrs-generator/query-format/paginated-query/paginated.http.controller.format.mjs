import { toCamelCase, toPascalCase } from '../util/string-convertor.mjs'

export function getPaginatedQueryHttpControllerContent(folderName, domainName) {
  return `import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { ${toPascalCase(domainName)}ResponseDto } from '../../dtos/${domainName}.response.dto'
import { ${toPascalCase(folderName)}RequestDto } from './${folderName}.request.dto'
import { ${toPascalCase(folderName)}Query } from './${folderName}.query-handler'

@Controller('${domainName}s')
export class ${toPascalCase(folderName)}HttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':${toCamelCase(domainName)}Id')
  async get(@Param() request: ${toPascalCase(folderName)}RequestDto): Promise<${toPascalCase(domainName)}ResponseDto> {
    const command = new ${toPascalCase(folderName)}Query(request)

    const result: ${toPascalCase(domainName)}s = await this.queryBus.execute(command)

    return new ${toPascalCase(domainName)}ResponseDto()
  }
}

`
}
