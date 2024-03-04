import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteDepartmentCommand } from './delete-department.command'
import { DeleteDepartmentRequestDto, DeleteDepartmentParamRequestDto } from './delete-department.request.dto'

@Controller('departments')
export class DeleteDepartmentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':departmentId')
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserEntity,
    @Param() param: DeleteDepartmentParamRequestDto,
    @Body() request: DeleteDepartmentRequestDto,
  ): Promise<void> {
    const command = new DeleteDepartmentCommand({
      departmentId: param.departmentId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
