import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationProp } from './interfaces/organization.interface'
import { OrganizationMember } from './database/organization.repository.port'
import { CreateOrganizationReq } from './dto/req/create-organization.req'
import { AuthGuard } from '../auth/authentication.guard'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { UserProp } from '../users/interfaces/user.interface'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('')
  async findAll(): Promise<OrganizationProp[]> {
    return await this.organizationService.findAll()
  }

  @Get('members')
  async findMembers(
    @Query('organizationId') organizationId: string,
  ): Promise<OrganizationMember | OrganizationMember[]> {
    if (organizationId) {
      return await this.organizationService.findMembersByOrganizationId(organizationId)
    } else {
      return await this.organizationService.findMembers()
    }
  }

  @Get('my/members')
  @UseGuards(AuthGuard)
  async findMyMembers(
    @User() user: Pick<UserProp, 'id' | 'organizationId'>,
  ): Promise<OrganizationMember | OrganizationMember[]> {
    return await this.organizationService.findMembersByOrganizationId(user.organizationId)
  }

  @Post('')
  async createOrganization(@Body() dto: CreateOrganizationReq) {
    return await this.organizationService.createOrganization(dto)
  }
}
