import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { PositionResponseDto } from './dtos/position.response.dto'
import { AuthGuard } from '../auth/authentication.guard'
import { CreateMemberPositionRequestDto } from './commands/craete-member-position/create-user-position.request.dto'
import { DeleteMemberPositionRequestDto } from './commands/delete-member-position/delete-member-position.request.dto'
import { StatesResponseDto } from './dtos/states.response.dto'

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Get('positions')
  async getFindAllPositions(): Promise<PositionResponseDto[]> {
    return await this.departmentService.findAllPositions()
  }

  // // can use manager
  // @Post('member-positions')
  // @UseGuards(AuthGuard)
  // async postAppointPosition(@Body() dto: CreateMemberPositionRequestDto): Promise<void> {
  //   return await this.departmentService.appointPosition(dto.userId, dto.positionId)
  // }

  // // can use only manager
  // @Delete('member-positions')
  // @UseGuards(AuthGuard)
  // async deleteRevokePosition(@Query() param: DeleteMemberPositionRequestDto): Promise<void> {
  //   return await this.departmentService.revokePosition(param.userId, param.positionId)
  // }

  // when select states that issue a license
  @Get('states')
  async getFindAllStates(): Promise<StatesResponseDto[]> {
    const result = await this.departmentService.findAllStates()
    return result.map(
      (state) =>
        new StatesResponseDto({
          stateName: state.stateName,
          abbreviation: state.abbreviation,
          geoId: state.geoId || null,
          stateCode: state.stateCode || null,
          ansiCode: state.ansiCode || null,
          stateLongName: state.stateLongName || null,
        }),
    )
  }
}
