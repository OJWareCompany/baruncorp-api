import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { AuthGuard } from '../auth/authentication.guard'
import { User } from '../../libs/decorators/requests/logged-in-user.decorator'
import { UserResponseDto } from '../users/dtos/user.response.dto'
import { UserEntity } from '../users/domain/user.entity'
import { FindOrganizationRequestDto } from './queries/find-organization/find-orginazation.request.dto'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('members')
  async findMembers(@Query() dto: FindOrganizationRequestDto): Promise<UserResponseDto[]> {
    return await this.organizationService.findMembersByOrganizationId(dto.organizationId)
  }

  // user decorator expose entity above the controller layer
  @Get('my/members')
  @UseGuards(AuthGuard)
  async findMyMembers(@User() user: UserEntity): Promise<UserResponseDto[]> {
    return await this.organizationService.findMembersByOrganizationId(user.getProps().organizationId)
  }
}
