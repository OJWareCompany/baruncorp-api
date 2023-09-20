import { Controller } from '@nestjs/common'
import { OrganizationService } from './organization.service'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
}
