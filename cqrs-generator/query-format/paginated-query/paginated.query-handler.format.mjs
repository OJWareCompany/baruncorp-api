import { toCamelCase, toPascalCase } from '../../util/string-convertor.mjs'

export function getPaginatedQueryHandlerContent(folderName, domainName) {
  return `import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
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

  async execute(query: ${toPascalCase(folderName)}Query): Promise<any> {
    const result = await this.prismaService.${toCamelCase(domainName)}.findUnique({ where: { id: query.${toCamelCase(
    domainName,
  )}Id } })
    if (!result) throw new NotFoundException()
    return result
  }
}
`
}
