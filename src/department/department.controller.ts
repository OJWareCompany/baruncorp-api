import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { CreateLicenseRequestDto } from './dto/create-license.request.dto'
import { LicenseType } from './interfaces/license.interface'
import { PositionResponseDto } from './dto/position.response.dto'

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Get('positions')
  async findAllPositions(): Promise<PositionResponseDto[]> {
    return this.departmentService.findAllPositions()
  }

  // can use manager
  @Post('user-position')
  async appointPosition(@Query('userId') userId: string, @Query('positionId') positionId: string): Promise<void> {
    return await this.departmentService.appointPosition(userId, positionId)
  }

  // can use only manager
  @Delete('user-position')
  async revokePosition(@Query('userId') userId: string, @Query('positionId') positionId: string): Promise<void> {
    return this.departmentService.revokePosition(userId, positionId)
  }

  // when select states that issue a license
  @Get('states')
  async findAllStates(): Promise<void> {
    return this.departmentService.findAllStates()
  }

  /**
   * 등록된 모든 라이센스 조회
   * 라이센스: 특정 State에서 작업 허가 받은 Member의 자격증
   */
  @Get('licenses')
  async findAllLicenses(): Promise<void> {
    return this.departmentService.findAllLicenses()
  }

  // TODO: create api doesn't retrieve? how handel conflict error?
  @Post('licenses')
  async postLicense(@Body() dto: CreateLicenseRequestDto): Promise<void> {
    return this.departmentService.registerLicense(
      dto.userId,
      dto.type,
      dto.issuingCountryName,
      dto.abbreviation,
      dto.priority,
      new Date(dto.issuedDate),
      new Date(dto.expiryDate),
    )
  }

  @Delete('licenses')
  async deleteLicense(
    @Query('userId') userId: string,
    @Query('type') type: LicenseType,
    @Query('issuingCountryName') issuingCountryName: string,
  ): Promise<void> {
    return this.departmentService.revokeLicense(userId, type, issuingCountryName)
  }
}
