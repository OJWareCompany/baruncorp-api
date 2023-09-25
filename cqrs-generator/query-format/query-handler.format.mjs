import { toPascalCase } from '../util/string-convertor.mjs'

export function getQueryHandlerContent(folderName) {
  return `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
  
export class ${toPascalCase(folderName)}Query {
  readonly id: string
  constructor(props: ${toPascalCase(folderName)}Query) {
    initialize(this, props)
  }
}

@QueryHandler(${toPascalCase(folderName)}Query)
export class ${toPascalCase(folderName)}QueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: ${toPascalCase(folderName)}Query): Promise<any> {
    const result = await this.prismaService.service.findUnique({ where: { id: query.id } })
    //if (!result) throw new ServiceNotFoundException()
    return result
  }
}

`
}
