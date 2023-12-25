import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateOrganizationRequestDto } from './create-organization.request.dto'
import { CreateOrganizationCommand } from './create-organization.command'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { ApiResponse } from '@nestjs/swagger'

@Controller('organizations')
export class CreateOrganizationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async postCreateOrganization(@Body() dto: CreateOrganizationRequestDto): Promise<IdResponse> {
    const command = new CreateOrganizationCommand(dto)
    const result = await this.commandBus.execute(command)
    return new IdResponse(result.id)
  }
}
