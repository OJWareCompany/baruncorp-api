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
  CreateOrUpdateAhjNoteFoldersRequestPayload,
  CreateOrUpdateAhjNoteFoldersResponse,
  CreateOrUpdateAhjNoteFoldersResponseData,
  DeleteItemsInSharedDriveRequestPayload,
  GetPropertyTypeFolderResponse,
  GetPropertyTypeFolderResponseData,
  GetSharedDriveIdByFolderIdResponse,
  GetSharedDriveIdByFolderIdResponseData,
  PostRfiReplyFilesRequestPayload,
  PostRfiReplyFilesResponse,
  PostRfiReplyFilesResponseData,
  RollbackCreateOrUpdateAhjNoteFoldersRequestPayload,
  RollbackCreateOrUpdateAhjNoteFoldersResponse,
  RollbackUpdateProjectFoldersRequestPayload,
  RollbackUpdateProjectFoldersResponse,
  UpdateGoogleProjectFoldersRequestPayload,
  UpdateGoogleProjectFoldersResponse,
  UpdateGoogleProjectFoldersResponseData,
} from './filesystem.api.type'
import { Attachment } from 'mailparser'
import FormData from 'form-data'

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

  async requestToPostRfiReplyFiles({
    attachments,
    jobNoteNumber,
    jobNotesFolderId,
    jobNoteId,
  }: PostRfiReplyFilesRequestPayload): Promise<PostRfiReplyFilesResponseData> {
    const formData = new FormData()
    attachments.forEach((attachment: Attachment) => {
      formData.append('files', Buffer.from(attachment.content), {
        filename: attachment.filename,
        contentType: attachment.contentType,
      })
    })
    formData.append('jobNoteNumber', jobNoteNumber)
    formData.append('jobNotesFolderId', jobNotesFolderId)
    formData.append('jobNoteId', jobNoteId)
    try {
      const url = `${this.baseUrl}/rfiReplyFiles`
      const response: PostRfiReplyFilesResponse = await got
        .post(url, {
          body: formData,
          headers: {
            'content-type': 'multipart/form-data; boundary=' + formData.getBoundary(),
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
      throw new FileServerInternalErrorException()
    }
  }

  async requestToGetPropertyTypeFolder(sharedDriveId: string): Promise<GetPropertyTypeFolderResponseData> {
    try {
      const url = `${this.baseUrl}/${sharedDriveId}/propertyTypeFolder`
      const response: GetPropertyTypeFolderResponse = await got.get(url).json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
      throw new FileServerInternalErrorException()
    }
  }

  async requestToGetSharedDriveIdByFolderId(folderId: string): Promise<GetSharedDriveIdByFolderIdResponseData> {
    try {
      const url = `${this.baseUrl}/${folderId}/sharedDriveId`
      const response: GetSharedDriveIdByFolderIdResponse = await got.get(url).json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
      throw new FileServerInternalErrorException()
    }
  }

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
    propertyTypeFolderId,
    projectName,
  }: CreateGoogleProjectFolderRequestPayload): Promise<CreateGoogleProjectFolderResponseData> {
    try {
      const url = `${this.baseUrl}/project`
      const response: CreateGoogleProjectFolderResponse = await got
        .post(url, {
          json: {
            sharedDriveId,
            propertyTypeFolderId,
            projectName,
          },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      const { errorCode } = JSON.parse(error.response.body)
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

      const { errorCode } = JSON.parse(error.response.body)
      if (errorCode === 'PARENT_FOLDER_NOT_FOUND_ERROR') {
        throw new GoogleDriveParentFolderNotFoundException()
      }

      throw new FileServerInternalErrorException()
    }
  }

  async requestToUpdateProjectFolders(
    payload: UpdateGoogleProjectFoldersRequestPayload,
  ): Promise<UpdateGoogleProjectFoldersResponseData> {
    try {
      const url = `${this.baseUrl}/project`
      const response: UpdateGoogleProjectFoldersResponse = await got
        .patch(url, {
          json: { ...payload },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)

      const { errorCode, message } = JSON.parse(error.response.body)
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

  async requestToRollbackUpdateProjectFolders({
    updatedProjectInfos,
  }: RollbackUpdateProjectFoldersRequestPayload): Promise<null> {
    try {
      const url = `${this.baseUrl}/project/rollback`
      const response: RollbackUpdateProjectFoldersResponse = await got
        .patch(url, {
          json: { updatedProjectInfos },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
      throw new FileServerInternalErrorException()
    }
  }

  async requestToCreateOrUpdateAhjNoteFolders({
    ahjNoteFolderDatas,
  }: CreateOrUpdateAhjNoteFoldersRequestPayload): Promise<CreateOrUpdateAhjNoteFoldersResponseData> {
    try {
      const url = `${this.baseUrl}/ahjNoteFolders`
      const response: CreateOrUpdateAhjNoteFoldersResponse = await got
        .post(url, {
          json: { ahjNoteFolderDatas },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
      throw new FileServerInternalErrorException()
    }
  }

  async requestToRollbackCreateOrUpdateAhjNoteFolders({
    ahjNoteFolderOperationResults,
  }: RollbackCreateOrUpdateAhjNoteFoldersRequestPayload): Promise<null> {
    try {
      const url = `${this.baseUrl}/ahjNoteFolders/rollback`
      const response: RollbackCreateOrUpdateAhjNoteFoldersResponse = await got
        .post(url, {
          json: { ahjNoteFolderOperationResults },
        })
        .json()
      return response.data
    } catch (error: any) {
      if (error.code) handleRequestError(error.code)
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
