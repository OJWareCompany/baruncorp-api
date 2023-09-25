import { toPascalCase } from '../util/string-convertor.mjs'

export function getQueryHttpControllerContent(folderName) {
  return `import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ${toPascalCase(folderName)}RequestDto } from './${folderName}.request.dto'
import { ${toPascalCase(folderName)}Query } from './${folderName}.query-handler'

@Controller('example')
export class ${toPascalCase(folderName)}HttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':example')
  async get(@Param() request: ${toPascalCase(folderName)}RequestDto): Promise<ResponseDto> {
    const command = new ${toPascalCase(folderName)}Query(request)

    const result: any = await this.queryBus.execute(command)

    return new ResponseDto()
  }
}
`
}
