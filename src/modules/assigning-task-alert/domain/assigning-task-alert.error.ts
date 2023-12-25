import { NotFoundException } from '@nestjs/common'

export class AssigningTaskAlertNotFoundException extends NotFoundException {
  constructor() {
    super('Not assigning task alert found. ', '20020')
  }
}
