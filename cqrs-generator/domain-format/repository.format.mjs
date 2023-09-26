import { toCamelCase, toPascalCase, toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getRepositoryFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  const repo = `${toCamelCase(domainName)}Repo`
  const mapper = `${toCamelCase(domainName)}Mapper`
  return `import { Injectable } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ${toPascalCase(domainName)}Mapper } from '../${domainName}.mapper'
import {${toPascalCase(domainName)}RepositoryPort } from './${domainName}.repository.port'

@Injectable()
export class ${toPascalCase(domainName)}Repository implements ${toPascalCase(domainName)}RepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ${mapper}: ${toPascalCase(domainName)}Mapper,
  ) {
    insert(entity: ${entity}): Promise<AggregateID> {
      const record = this.${mapper}.toPersistance(entity)
      await this.prismaService.${toCamelCase(domainName)}s.create({ data: record })
    }
  }
}
`
}
