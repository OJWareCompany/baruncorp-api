import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationProp } from './interfaces/organization.interface'
import { CreateOrganizationReq } from './dto/req/create-organization.req'
import { AuthGuard } from '../auth/authentication.guard'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { UserResponseDto } from '../users/dto/req/user.response.dto'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  @Get('')
  async findAll(): Promise<OrganizationProp[]> {
    return await this.organizationService.findAll()
  }

  @Get('members')
  async findMembers(@Query('organizationId') organizationId: string): Promise<UserResponseDto[]> {
    return await this.organizationService.findMembersByOrganizationId(organizationId)
  }

  @Get('my/members')
  @UseGuards(AuthGuard)
  async findMyMembers(@User() user: { id: string; organizationId: string }): Promise<UserResponseDto[]> {
    return await this.organizationService.findMembersByOrganizationId(user.organizationId)
  }

  @Post('')
  async createOrganization(@Body() dto: CreateOrganizationReq) {
    return await this.organizationService.createOrganization(dto)
  }
}
