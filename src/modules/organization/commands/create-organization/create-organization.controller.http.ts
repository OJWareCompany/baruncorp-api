import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AuthGuard } from '../../../auth/authentication.guard'
import { CreateOrganizationRequestDto } from './create-organization.request.dto'
import { CreateOrganizationCommand } from './create-organization.command'

@Controller('organizations')
export class CreateOrganizationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @UseGuards(AuthGuard)
  async postCreateOrganization(@Body() dto: CreateOrganizationRequestDto): Promise<{ organizationId: string }> {
    const command = new CreateOrganizationCommand(dto)
    return await this.commandBus.execute(command)
  }
}
