import { toCamelCase } from '../util/toCamelCase.mjs'

export function getQueryHttpControllerContent(folderName) {
  return `import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ${toCamelCase(folderName)}RequestDto } from './${folderName}.request.dto'
import { ${toCamelCase(folderName)}Query } from './${folderName}.query-handler'

@Controller('example')
export class ${toCamelCase(folderName)}HttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':example')
  async get(@Param() request: ${toCamelCase(folderName)}RequestDto): Promise<ResponseDto> {
    const command = new ${toCamelCase(folderName)}Query(request)

    const result: any = await this.queryBus.execute(command)

    return new ResponseDto()
  }
}
`
}
