import { toPascalCase } from '../util/string-convertor.mjs'

export function getHttpControllerContent(folderName, domainName, type) {
  const decorator = type === 'POST' ? 'Post' : type === 'PATCH' ? 'Patch' : type === 'DELETE' ? 'Delete' : ''

  return `import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, ${decorator}, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { ${toPascalCase(folderName)}Command } from './${folderName}.command'
import { ${toPascalCase(folderName)}RequestDto } from './${folderName}.request.dto'

@Controller('${domainName}s')
export class ${toPascalCase(folderName)}HttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @${decorator}('')
  @UseGuards(AuthGuard)
  async ${type.toLocaleLowerCase()}(@User() user: UserEntity, @Body() request: ${toPascalCase(
    folderName,
  )}RequestDto): Promise<IdResponse> {
    const command = new ${toPascalCase(folderName)}Command(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
`
}
