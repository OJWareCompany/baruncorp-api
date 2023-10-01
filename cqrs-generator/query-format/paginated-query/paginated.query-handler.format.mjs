import { toCamelCase, toPascalCase } from '../../util/string-convertor.mjs'

export function getPaginatedQueryHandlerContent(folderName, domainName) {
  return `import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class ${toPascalCase(folderName)}Query extends PaginatedQueryBase {
  readonly ${toCamelCase(domainName)}Id: string
  constructor(props: PaginatedParams<${toPascalCase(folderName)}Query>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(${toPascalCase(folderName)}Query)
export class ${toPascalCase(folderName)}QueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: ${toPascalCase(folderName)}Query): Promise<Paginated<${toPascalCase(domainName)}s>> {
    const result = await this.prismaService.${toCamelCase(domainName)}s.findMany({
      where: { id: query.${toCamelCase(domainName)}Id },
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.${toCamelCase(domainName)}s.count({
      where: { id: query.${toCamelCase(domainName)}Id },
    })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
`
}
