import { CommandBus } from '@nestjs/cqrs'
import { Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteDepartmentCommand } from './delete-department.command'
import { DeleteDepartmentParamRequestDto } from './delete-department.request.dto'

@Controller('departments')
export class DeleteDepartmentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':departmentId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeleteDepartmentParamRequestDto): Promise<void> {
    const command = new DeleteDepartmentCommand({
      departmentId: param.departmentId,
    })
    await this.commandBus.execute(command)
  }
}
