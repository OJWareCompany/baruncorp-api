import { toCamelCase, toPascalCase } from '../util/string-convertor.mjs'

export function getQueryHandlerContent(folderName, domainName) {
  return `import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class ${toPascalCase(folderName)}Query {
  readonly ${toCamelCase(domainName)}Id: string
  constructor(props: ${toPascalCase(folderName)}Query) {
    initialize(this, props)
  }
}

@QueryHandler(${toPascalCase(folderName)}Query)
export class ${toPascalCase(folderName)}QueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: ${toPascalCase(folderName)}Query): Promise<${toPascalCase(domainName)}s> {
    const result = await this.prismaService.${toCamelCase(domainName)}s.findUnique({ where: { id: query.${toCamelCase(
    domainName,
  )}Id } })
    if (!result) throw new NotFoundException()
    return result
  }
}

`
}
