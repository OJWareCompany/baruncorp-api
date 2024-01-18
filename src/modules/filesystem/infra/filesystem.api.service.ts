import { Injectable } from '@nestjs/common'
import got from 'got'
import {
  FileServerInternalErrorException,
  FileServerTimeoutException,
  FileServerUnavailableException,
  GoogleDriveBadRequestException,
  GoogleDriveConflictException,
  GoogleDriveFailedUpdateFolderException,
  GoogleDriveParentFolderNotFoundException,
} from '../domain/filesystem.error'
import {
  CreateGoogleJobFolderRequestPayload,
  CreateGoogleJobFolderResponse,
  CreateGoogleJobFolderResponseData,
  CreateGoogleProjectFolderRequestPayload,
  CreateGoogleProjectFolderResponse,
  CreateGoogleProjectFolderResponseData,
  CreateGoogleSharedDriveResponse,
  CreateGoogleSharedDriveResponseData,
  DeleteItemsInSharedDriveRequestPayload,
  UpdateGoogleProjectFolderRequestPayload,
  UpdateGoogleProjectFolderResponse,
  UpdateGoogleProjectFolderResponseData,
} from './filesystem.api.type'

const handleRequestError = (errorCode: string) => {
  if (errorCode === 'ECONNREFUSED') {
    throw new FileServerUnavailableException()
  } else if (errorCode === 'ETIMEDOUT') {
    throw new FileServerTimeoutException()
  }
}

@Injectable()
export class FilesystemApiService {
  private baseUrl = `${process.env.FILE_API_URL}/filesystem`

  async requestToCreateGoogleSharedDrive(name: string): Promise<CreateGoogleSharedDriveResponseData> {
    try {
      const url = `${this.baseUrl}/sharedDrive`
      const response: CreateGoogleSharedDriveResponse = await got
        .post(url, {
          json: {
            sharedDrive: name,
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      throw new FileServerInternalErrorException()
    }
  }

  async requestToCreateProjectFolder({
    sharedDriveId,
    residentailOrCommercialFolderId,
    projectName,
  }: CreateGoogleProjectFolderRequestPayload): Promise<CreateGoogleProjectFolderResponseData> {
    try {
      const url = `${this.baseUrl}/project`
      const response: CreateGoogleProjectFolderResponse = await got
        .post(url, {
          json: {
            sharedDriveId,
            residentailOrCommercialFolderId,
            projectName,
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      const errorCode = error.response.body.errorCode
      if (errorCode === 'PARENT_FOLDER_NOT_FOUND_ERROR') {
        throw new GoogleDriveParentFolderNotFoundException()
      }

      throw new FileServerInternalErrorException()
    }
  }

  async requestToCreateJobFolder({
    sharedDriveId,
    projectFolderId,
    jobName,
  }: CreateGoogleJobFolderRequestPayload): Promise<CreateGoogleJobFolderResponseData> {
    try {
      const url = `${this.baseUrl}/job`
      const response: CreateGoogleJobFolderResponse = await got
        .post(url, {
          json: {
            sharedDriveId,
            projectFolderId,
            jobName,
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      const errorCode = error.response.body.errorCode
      if (errorCode === 'PARENT_FOLDER_NOT_FOUND_ERROR') {
        throw new GoogleDriveParentFolderNotFoundException()
      }

      throw new FileServerInternalErrorException()
    }
  }

  async requestToUpdateProjectFolder({
    projectFolderId,
    changeName,
    changeTypeFolderId,
  }: UpdateGoogleProjectFolderRequestPayload): Promise<UpdateGoogleProjectFolderResponseData> {
    try {
      const url = `${this.baseUrl}/project`
      const response: UpdateGoogleProjectFolderResponse = await got
        .patch(url, {
          json: {
            projectFolderId,
            changeName,
            changeTypeFolderId,
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      const errorCode = error.response.body.errorCode
      const message = error.response.body.message
      if (errorCode === 'BAD_REQUEST_ERROR') {
        throw new GoogleDriveBadRequestException(message)
      } else if (errorCode === 'FAILED_UPDATE_ERROR') {
        throw new GoogleDriveFailedUpdateFolderException(message)
      } else if (errorCode === 'CONFLICT_ERROR') {
        throw new GoogleDriveConflictException(message)
      }

      throw new FileServerInternalErrorException()
    }
  }

  async requestToDeleteItemsInSharedDrive({ sharedDrive, itemIds }: DeleteItemsInSharedDriveRequestPayload) {
    const url = `${this.baseUrl}/sharedDrive/items`
    await got
      .delete(url, {
        json: {
          sharedDrive,
          itemIds,
        },
      })
      .json()
  }
}
