import { toCamelCase } from '../util/toCamelCase.mjs'

export function getHttpControllerContent(folderName) {
  return `import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { ${toCamelCase(folderName)}Command } from './${folderName}.command'
import { ${toCamelCase(folderName)}RequestDto } from './${folderName}.request.dto'

@Controller('${folderName}')
export class ${toCamelCase(folderName)}HttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() request: ${toCamelCase(
    folderName,
  )}RequestDto): Promise<IdResponse> {
    const command = new ${toCamelCase(folderName)}Command(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}`
}
