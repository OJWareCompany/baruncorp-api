import { toCamelCase, toPascalCase } from '../../util/string-convertor.mjs'

export function getPaginatedQueryHttpControllerContent(folderName, domainName) {
  return `import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { ${toPascalCase(domainName)}PaginatedResponseDto } from '../../dtos/${domainName}.paginated.response.dto'
import { ${toPascalCase(folderName)}RequestDto } from './${folderName}.request.dto'
import { ${toPascalCase(folderName)}Query } from './${folderName}.query-handler'

@Controller('${domainName}s')
export class ${toPascalCase(folderName)}HttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: ${toPascalCase(folderName)}RequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<${toPascalCase(domainName)}PaginatedResponseDto> {
    const command = new ${toPascalCase(folderName)}Query({
      ...request,
      ...queryParams,
    })

    const result: Paginated<${toPascalCase(domainName)}s> = await this.queryBus.execute(command)

    return new ${toPascalCase(domainName)}PaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
      })),
    })
  }
}
`
}
