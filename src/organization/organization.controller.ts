import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { CreateOrganizationRequestDto } from './commands/create-organization/create-organization.request.dto'
import { AuthGuard } from '../auth/authentication.guard'
import { User } from '../common/decorators/requests/logged-in-user.decorator'
import { UserResponseDto } from '../users/dtos/user.response.dto'
import { Address } from './domain/value-objects/address.vo'
import { UserEntity } from '../users/domain/user.entity'
import { OrganizationResponseDto } from './dtos/organization.response.dto'
import { FindOrganizationRequestDto } from './queries/find-orginazation.request.dto'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  @Get('')
  async findAll(): Promise<OrganizationResponseDto[]> {
    return await this.organizationService.findAll()
  }

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

  @Post('')
  @UseGuards(AuthGuard)
  async createOrganization(@Body() dto: CreateOrganizationRequestDto) {
    return await this.organizationService.createOrganization({
      name: dto.name,
      description: dto.description,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      organizationType: dto.organizationType,
      address: new Address({
        street1: dto.street1,
        street2: dto.street2,
        city: dto.city,
        stateOrRegion: dto.stateOrRegion,
        postalCode: dto.postalCode,
        country: dto.country,
      }),
    })
  }
}
