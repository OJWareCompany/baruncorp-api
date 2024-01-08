import { toCamelCase, toPascalCase } from '../util/string-convertor.mjs'

export function getUpdateHttpControllerContent(folderName, domainName, type) {
  const decorator = type === 'POST' ? 'Post' : type === 'PATCH' ? 'Patch' : type === 'DELETE' ? 'Delete' : ''

  return `import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, ${decorator}, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { ${toPascalCase(folderName)}Command } from './${folderName}.command'
import { ${toPascalCase(folderName)}RequestDto, ${toPascalCase(
    folderName,
  )}ParamRequestDto } from './${folderName}.request.dto'

@Controller('${domainName}s')
export class ${toPascalCase(folderName)}HttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @${decorator}(':${toCamelCase(domainName)}Id')
  @UseGuards(AuthGuard)
  async ${type.toLocaleLowerCase()}(
    @User() user: UserEntity,
    @Param() param: ${toPascalCase(folderName)}ParamRequestDto,
    @Body() request: ${toPascalCase(folderName)}RequestDto,
  ): Promise<void> {
    const command = new ${toPascalCase(folderName)}Command({
      ${toCamelCase(domainName)}Id: param.${toCamelCase(domainName)}Id,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
`
}
