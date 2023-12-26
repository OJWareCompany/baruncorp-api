import { NotFoundException } from '@nestjs/common'

export class UserLicenseNotFoundException extends NotFoundException {
  constructor() {
    super('Not User License Found.', '20601')
  }
}
