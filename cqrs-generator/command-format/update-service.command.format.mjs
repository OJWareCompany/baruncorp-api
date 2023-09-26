import { toCamelCase, toPascalCase, toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getUpdateCommand(folderName, domainName) {
  return `/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { ${toPascalCase(domainName)}RepositoryPort } from '../../database/${domainName}.repository.port'
import { ${toPascalCase(domainName)}NotFoundException } from '../../domain/${domainName}.error'
import { ${toScreamingSnakeCase(domainName)}_REPOSITORY } from '../../${domainName}.di-token'
import { ${toPascalCase(folderName)}Command } from './${folderName}.command'

@CommandHandler(${toPascalCase(folderName)}Command)
export class ${toPascalCase(folderName)}Service implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(${toScreamingSnakeCase(domainName)}_REPOSITORY)
    private readonly ${toCamelCase(domainName)}Repo: ${toCamelCase(domainName)}RepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: ${toPascalCase(folderName)}Command): Promise<void> {
    const entity = await this.${toCamelCase(domainName)}Repo.findOne(command.${toCamelCase(domainName)}Id)
    if (!entity) throw new ${toPascalCase(domainName)}NotFoundException()
    await this.${toCamelCase(domainName)}Repo.update(entity)
  }
}
`
}
