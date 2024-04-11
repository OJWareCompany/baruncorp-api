import {
  ServiceUnavailableException,
  RequestTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

export class FileServerUnavailableException extends ServiceUnavailableException {
  constructor() {
    super(`File server is unavaliable`, '11002')
  }
}

export class FileServerTimeoutException extends RequestTimeoutException {
  constructor() {
    super(`Request to file server timed out`, '11003')
  }
}

export class FileServerInternalErrorException extends InternalServerErrorException {
  constructor(message = 'Error from file server') {
    super(message, '11004')
  }
}

export class GoogleDriveSharedDriveNotFoundException extends NotFoundException {
  constructor() {
    super('Not Google Shared Drive Found.', '11005')
  }
}

export class GoogleDriveProjectFolderNotFoundException extends NotFoundException {
  constructor() {
    super('Not Project Folder Found.', '11006')
  }
}

export class GoogleDriveJobFolderNotFoundException extends NotFoundException {
  constructor() {
    super('Not Job Folder Found.', '11007')
  }
}

export class GoogleDriveDeliverablesFolderShareLinkNoExistException extends NotFoundException {
  constructor() {
    super('No Deliverables Folder Exist.', '11008')
  }
}

export class GoogleDriveFolderNotFoundException extends NotFoundException {
  constructor(message = 'Google Drive Folder Not Found') {
    super(message, '11009')
  }
}

export class GoogleDriveConflictException extends ConflictException {
  constructor(message = 'Conflict Error of GoogleDrive') {
    super(message, '11010')
  }
}

export class GoogleDriveFailedUpdateFolderException extends InternalServerErrorException {
  constructor(message = 'Failed Update Error of GoogleDrive') {
    super(message, '11011')
  }
}

export class GoogleDriveBadRequestException extends BadRequestException {
  constructor(message = 'Failed Update Error of GoogleDrive') {
    super(message, '11012')
  }
}

export class GoogleDriveJobNotesFolderNotFoundException extends NotFoundException {
  constructor() {
    super('Not Parent Folder Found', '11013')
  }
}

export class GoogleDriveApiException extends InternalServerErrorException {
  constructor(message = 'Google Api Not Work') {
    super(message, '11014')
  }
}
