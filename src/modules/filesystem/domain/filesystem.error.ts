import { ConflictException, NotFoundException } from '@nestjs/common'

export class FilesystemNotFoundException extends NotFoundException {
  constructor() {
    super('Not Filesystem found', '')
  }
}

export class OrganizationSharedDriveConflictException extends ConflictException {
  constructor(name: string) {
    // 에러 코드를 다르게 할까? 구글 드라이브에서 에러가 발생했다는 사실을 알리기 위해 에러 코드를 다르게 줘야 할까?
    super(`Shared Drive(${name}) is already existed.`, '11001')
  }
}
