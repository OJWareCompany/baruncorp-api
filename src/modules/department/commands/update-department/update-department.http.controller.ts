import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UpdateDepartmentRequestDto, UpdateDepartmentParamRequestDto } from './update-department.request.dto'
import { UpdateDepartmentCommand } from './update-department.command'

@Controller('departments')
export class UpdateDepartmentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':departmentId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateDepartmentParamRequestDto,
    @Body() request: UpdateDepartmentRequestDto,
  ): Promise<void> {
    const command = new UpdateDepartmentCommand({
      departmentId: param.departmentId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
