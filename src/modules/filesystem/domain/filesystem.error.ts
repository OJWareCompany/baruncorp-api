import { NotFoundException } from '@nestjs/common'

export class FilesystemNotFoundException extends NotFoundException {
  constructor() {
    super('Not Filesystem found', '')
  }
}
