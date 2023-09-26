import { toCamelCase, toPascalCase, toUnderBar } from '../util/string-convertor.mjs'

export function getRepositoryFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  const repo = `${toCamelCase(domainName)}Repo`
  const mapper = `${toCamelCase(domainName)}Mapper`
  return `import { Injectable } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { AggregateID } from '../../../libs/ddd/entity.base'
import { PrismaService } from '../../database/prisma.service'
import { ${toPascalCase(domainName)}Mapper } from '../${domainName}.mapper'
import { ${entity} } from '../domain/book-store.entity'
import {${toPascalCase(domainName)}RepositoryPort } from './${domainName}.repository.port'

@Injectable()
export class ${toPascalCase(domainName)}Repository implements ${toPascalCase(domainName)}RepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ${mapper}: ${toPascalCase(domainName)}Mapper,
  ) {
  }

  async insert(entity: ${entity}): Promise<AggregateID> {
    const record = this.${mapper}.toPersistence(entity)
    await this.prismaService.${toCamelCase(domainName)}s.create({ data: record })
  }

  async update(entity: ${entity}): Promise<void> {
    const record = this.${mapper}.toPersistence(entity)
    await this.prismaService.${toCamelCase(domainName)}s.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<${toPascalCase(domainName)}s>\`DELETE FROM ${toUnderBar(
    domainName,
  )} WHERE id = \${id}\`
  }

  async findOne(id: string): Promise<${entity} | null> {
    await this.prismaService.${toCamelCase(domainName)}s.findUnique({ where: { id } })
    return record ? this.${mapper}.toDomain(record) : null
  }
}
`
}
