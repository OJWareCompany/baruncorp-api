import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { PositionResponseDto } from './dtos/position.response.dto'
import { ServiceResponseDto } from './service.mapper'
import { CreateMemberInChargeOfTheServiceRequestDto } from './commands/create-member-in-charge-of-the-service/create-member-in-charge-of-the-service.request.dto'
import { AuthGuard } from '../auth/authentication.guard'
import { CreateMemberPositionRequestDto } from './commands/craete-member-position/create-user-position.request.dto'
import { DeleteMemberPositionRequestDto } from './commands/delete-member-position/delete-member-position.request.dto'
import { DeleteMemberInChargeOfTheServiceRequestDto } from './commands/delete-member-in-charge-of-the-service/delete-member-in-charge-of-the-service.request.dto'
import { FindStatesResponseDto } from './dtos/find-states.response.dto'

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Get('positions')
  async findAllPositions(): Promise<PositionResponseDto[]> {
    return await this.departmentService.findAllPositions()
  }

  // can use manager
  @Post('member-positions')
  @UseGuards(AuthGuard)
  async appointPosition(@Query() param: CreateMemberPositionRequestDto): Promise<void> {
    return await this.departmentService.appointPosition(param.userId, param.positionId)
  }

  // can use only manager
  @Delete('member-positions')
  @UseGuards(AuthGuard)
  async revokePosition(@Query() param: DeleteMemberPositionRequestDto): Promise<void> {
    return await this.departmentService.revokePosition(param.userId, param.positionId)
  }

  // when select states that issue a license
  @Get('states')
  async findAllStates(): Promise<FindStatesResponseDto[]> {
    const result = await this.departmentService.findAllStates()
    return result.map(
      (state) =>
        new FindStatesResponseDto({
          stateName: state.stateName,
          abbreviation: state.abbreviation,
          geoId: state.geoId,
          stateCode: state.stateCode,
          ansiCode: state.ansiCode,
          stateLongName: state.stateLongName,
        }),
    )
  }

  @Get('services')
  async findAllServices(): Promise<ServiceResponseDto[]> {
    return await this.departmentService.findAllServices()
  }

  // TODO: create api doesn't retrieve? how handel conflict error?
  @Post('member-services')
  @UseGuards(AuthGuard)
  async putMemberInChageOfTheService(@Body() dto: CreateMemberInChargeOfTheServiceRequestDto): Promise<void> {
    return this.departmentService.putMemberInChageOfTheService(dto.userId, dto.serviceId)
  }

  @Delete('member-services')
  @UseGuards(AuthGuard)
  async terminateServiceMemberIsInChargeOf(@Query() query: DeleteMemberInChargeOfTheServiceRequestDto): Promise<void> {
    return this.departmentService.terminateServiceMemberIsInChargeOf(query.userId, query.serviceId)
  }
}
