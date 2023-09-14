import { NotFoundException } from '@nestjs/common'

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('Not Project Found.', '30001')
  }
}
