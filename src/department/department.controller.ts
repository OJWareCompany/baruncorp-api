import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { PositionResponseDto } from './dtos/position.response.dto'
import { ServiceResponseDto } from './service.mapper'
import { PutMemberInChargeOfTheServiceRequestDto } from './commands/update-member-in-charge-of-the-service/put-member-in-charge-of-the-service.request.dto'
import { AuthGuard } from '../auth/authentication.guard'
import { State } from './domain/value-objects/state.vo'

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
  async appointPosition(@Query('userId') userId: string, @Query('positionId') positionId: string): Promise<void> {
    return await this.departmentService.appointPosition(userId, positionId)
  }

  // can use only manager
  @Delete('member-positions')
  @UseGuards(AuthGuard)
  async revokePosition(@Query('userId') userId: string, @Query('positionId') positionId: string): Promise<void> {
    return await this.departmentService.revokePosition(userId, positionId)
  }

  // when select states that issue a license
  @Get('states')
  async findAllStates(): Promise<State[]> {
    return await this.departmentService.findAllStates()
  }

  @Get('services')
  async findAllServices(): Promise<ServiceResponseDto[]> {
    return await this.departmentService.findAllServices()
  }

  // TODO: create api doesn't retrieve? how handel conflict error?
  @Post('member-services')
  @UseGuards(AuthGuard)
  async putMemberInChageOfTheService(@Body() dto: PutMemberInChargeOfTheServiceRequestDto): Promise<void> {
    return this.departmentService.putMemberInChageOfTheService(dto.userId, dto.serviceId)
  }

  @Delete('member-services')
  @UseGuards(AuthGuard)
  async terminateServiceMemberIsInChargeOf(
    @Query('userId') userId: string,
    @Query('serviceId') serviceId: string,
  ): Promise<void> {
    return this.departmentService.terminateServiceMemberIsInChargeOf(userId, serviceId)
  }
}
