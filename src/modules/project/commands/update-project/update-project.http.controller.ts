import { Body, Controller, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { UpdateProjectCommand } from './update-project.command'
import { UpdateProjectRequestDto, UpdateProjectRequestParamDto } from './update-project.request.dto'
import { AuthGuard } from '../../../auth/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { Address } from '../../../organization/domain/value-objects/address.vo'

@Controller('projects')
export class UpdateProjectHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':projectId')
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserEntity,
    @Param() param: UpdateProjectRequestParamDto,
    @Body() request: UpdateProjectRequestDto,
  ) {
    const command = new UpdateProjectCommand({
      projectId: param.projectId,
      projectPropertyType: request.projectPropertyType,
      projectPropertyOwner: request.projectPropertyOwner,
      projectNumber: request.projectNumber,
      projectPropertyAddress: new Address(request.projectPropertyAddress),
      // projectAssociatedRegulatory: request.projectAssociatedRegulatory,
      updatedByUserId: user.getProps().id,
    })
    await this.commandBus.execute(command)
  }
}
