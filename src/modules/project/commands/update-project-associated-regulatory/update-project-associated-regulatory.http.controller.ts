import { Body, Controller, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { UpdateProjectAssociatedRegulatoryCommand } from './update-project-associated-regulatory.command'
import {
  UpdateProjectAssociatedRegulatoryRequestDto,
  UpdateProjectRequestParamDto,
} from './update-project-associated-regulatory.request.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

@Controller('projects')
export class UpdateProjectAssociatedRegulatoryHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':projectId/associatedRegulatory')
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserEntity,
    @Param() param: UpdateProjectRequestParamDto,
    @Body() request: UpdateProjectAssociatedRegulatoryRequestDto,
  ) {
    const command = new UpdateProjectAssociatedRegulatoryCommand({
      projectId: param.projectId,
      projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
        stateId: request.stateId,
        countyId: request.countyId,
        countySubdivisionsId: request.countySubdivisionsId,
        placeId: request.placeId,
      }),
      updatedByUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
