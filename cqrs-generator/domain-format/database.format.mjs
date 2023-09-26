import { toCamelCase, toPascalCase, toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getRepositoryFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  return `import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ${entity}Mapper } from '../${domainName}.mapper'

export class ${entity}Repository implements ${entity}RepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    @Injectable('${toScreamingSnakeCase(domainName)}_REPOSITORY')
    private readonly ${toCamelCase(domainName)}Repo: ${entity}RepositoryPort,
    private readonly ${toCamelCase(domainName)}Mapper: ${entity}Mapper,
  ) {}
}
`
}
