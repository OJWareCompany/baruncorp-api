import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateInformationCommand } from './update-information.command'
import { UpdateInformationParamRequestDto, UpdateInformationRequestDto } from './update-information.request.dto'

@Controller('informations')
export class UpdateInformationHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':informationId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdateInformationParamRequestDto,
    @Body() request: UpdateInformationRequestDto,
    @User() user: UserEntity,
  ): Promise<void> {
    const command = new UpdateInformationCommand({
      informationId: param.informationId,
      updatedBy: user.id,
      ...request,
    })
    console.log(JSON.stringify(command))
    await this.commandBus.execute(command)
  }
}
