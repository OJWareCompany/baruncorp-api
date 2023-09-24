import { toCamelCase } from '../util/toCamelCase.mjs'

export function getServiceContent(folderName) {
  return `import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { ${toCamelCase(folderName)}Command } from './${folderName}.command'

@CommandHandler(${toCamelCase(folderName)}Command)
export class ${toCamelCase(folderName)}Service implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: ${toCamelCase(folderName)}Command): Promise<AggregateID> {
    const entity = Entity.create()
  }
}
`
}
