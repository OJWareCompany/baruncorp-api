import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePtoTenurePolicyCommand } from './update-pto-tenure-policy.command'
import {
  UpdatePtoTenurePolicyRequestDto,
  UpdatePtoTenurePolicyParamRequestDto,
} from './update-pto-tenure-policy.request.dto'

@Controller('pto-tenure-policies')
export class UpdatePtoTenurePolicyHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':ptoTenurePolicyId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdatePtoTenurePolicyParamRequestDto,
    @Body() request: UpdatePtoTenurePolicyRequestDto,
  ): Promise<void> {
    const command = new UpdatePtoTenurePolicyCommand({
      ptoTenurePolicyId: param.ptoTenurePolicyId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
