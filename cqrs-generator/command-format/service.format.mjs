import { toPascalCase, toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getServiceContent(folderName, domainName) {
  return `/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { ${toScreamingSnakeCase(domainName)}_REPOSITORY } from '../../${domainName}.di-token'
import { ${toPascalCase(domainName)}Entity } from '../../domain/${domainName}.entity'
import { ${toPascalCase(folderName)}Command } from './${folderName}.command'

@CommandHandler(${toPascalCase(folderName)}Command)
export class ${toPascalCase(folderName)}Service implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(${toScreamingSnakeCase(domainName)}_REPOSITORY)
    private readonly ${toPascalCase(domainName)}Repo: ${toPascalCase(domainName)}RepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: ${toPascalCase(folderName)}Command): Promise<AggregateID> {
    const entity = ${toPascalCase(domainName)}Entity.create({
      ...command,
    })
    return ''
  }
}
`
}
