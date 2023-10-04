import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UpdateOrganizationParamRequestDto, UpdateOrganizationRequestDto } from './update-organization.request.dto'
import { UpdateOrganizationCommand } from './update-organization.command'

@Controller('organizations')
export class UpdateOrganizationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':organizationId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdateOrganizationParamRequestDto,
    @Body() request: UpdateOrganizationRequestDto,
  ): Promise<void> {
    const command = new UpdateOrganizationCommand({
      ...param,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
