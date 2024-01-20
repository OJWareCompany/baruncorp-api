import { BadRequestException, NotFoundException } from '@nestjs/common'

export class InformationNotFoundException extends NotFoundException {
  constructor() {
    super('Not Informaition found', '21001')
  }
}
