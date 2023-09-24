import { toCamelCase } from '../util/toCamelCase.mjs'

export function getQueryHandlerContent(folderName) {
  return `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
  
export class ${toCamelCase(folderName)}Query {
  readonly id: string
  constructor(props: ${toCamelCase(folderName)}Query) {
    initialize(this, props)
  }
}

@QueryHandler(${toCamelCase(folderName)}Query)
export class ${toCamelCase(folderName)}QueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: ${toCamelCase(folderName)}Query): Promise<any> {
    const result = await this.prismaService.service.findUnique({ where: { id: query.id } })
    //if (!result) throw new ServiceNotFoundException()
    return result
  }
}

`
}
