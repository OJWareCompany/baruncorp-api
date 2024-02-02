import { InternalServerErrorException } from '@nestjs/common'

export class CommonInternalServerException extends InternalServerErrorException {
  constructor(message: string) {
    super(message, '50000')
  }
}

export class DataIntegrityException extends InternalServerErrorException {
  constructor(message: string) {
    super(message, '50001')
  }
}
