import { Attachment } from 'mailparser'
import { ProjectPropertyTypeEnum } from '../../project/domain/project.type'

/**
 * CreateGoogleProjectFolder
 */
export type PostRfiReplyFilesRequestPayload = {
  attachments: Attachment[]
  jobNoteNumber: number
  jobNotesFolderId: string
  jobNoteId: string
}
export type PostRfiReplyFilesResponse = {
  message: string
  data: PostRfiReplyFilesResponseData
}
export type PostRfiReplyFilesResponseData = {
  id: string
  shareLink: string
  jobNotesFolderId: string
  jobNoteId: string
  sharedDriveId: string
}

/**
 * PostCountJobFolder
 */
export type PostCountJobFolderResponse = {
  message: string
  data: PostCountJobFolderResponseData
}
export type PostCountJobFolderResponseData = {
  count: number
}

/**
 * GetPropertyTypeFolder
 */
export type GetPropertyTypeFolderResponse = {
  message: string
  data: GetPropertyTypeFolderResponseData
}
export type GetPropertyTypeFolderResponseData = {
  residentialFolder: {
    id: string
    name: string
  }
  commercialFolder: {
    id: string
    name: string
  }
}

/**
 * GetSharedDriveIdByFolder
 */
export type GetSharedDriveIdByFolderIdResponse = {
  message: string
  data: GetSharedDriveIdByFolderIdResponseData
}
export type GetSharedDriveIdByFolderIdResponseData = {
  sharedDriveId: string
}

/**
 * CreateGoogleProjectFolder
 */
export type CreateGoogleProjectFolderRequestPayload = {
  sharedDriveName: string
  sharedDriveVersion: string
  sharedDriveId: string
  propertyType: ProjectPropertyTypeEnum
  propertyTypeFolderId: string
  projectName: string
}
export type CreateGoogleProjectFolderResponseData = {
  projectFolder: {
    id: string
    name: string
    shareLink: string
    matchedExistingData: boolean
    parentless: boolean
  }
}
export type CreateGoogleProjectFolderResponse = {
  message: string
  data: CreateGoogleProjectFolderResponseData
}

/**
 * CreateGoogleJobFolder
 */
export type CreateGoogleJobFolderRequestPayload = {
  sharedDriveName: string
  sharedDriveVersion: string
  sharedDriveId: string
  propertyType: ProjectPropertyTypeEnum
  projectName: string
  projectFolderId: string
  jobName: string
  parentlessProjectFolder: boolean
}
export type CreateGoogleJobFolderResponse = {
  message: string
  data: CreateGoogleJobFolderResponseData
}
export type CreateGoogleJobFolderResponseData = {
  jobFolder: {
    id: string
    name: string
    shareLink: string
    matchedExistingData: boolean
    parentless: boolean
  }
  deliverablesFolder: {
    id: string
    name: string
    shareLink: string
    matchedExistingData: boolean
  }
  jobNotesFolder: {
    id: string
    name: string
    shareLink: string
    matchedExistingData: boolean
  }
}

/**
 * CreateGoogleSharedDrive
 */
export type CreateGoogleSharedDriveResponse = {
  message: string
  data: CreateGoogleSharedDriveResponseData
}
export type CreateGoogleSharedDriveResponseData = {
  sharedDrive: {
    id: string
    name: string
    matchedExistingData: boolean
  }
  residentialFolder: {
    id: string
    name: string
    matchedExistingData: boolean
  }
  commercialFolder: {
    id: string
    name: string
    matchedExistingData: boolean
  }
}

/**
 * UpdateGoogleProjectFolder
 */
export type UpdateGoogleProjectFoldersRequestPayload = {
  needUpdateProjectName: boolean
  toProjectFolderName: string | null
  needUpdateProjectPropertyType: boolean
  toProjectPropertyType: ProjectPropertyTypeEnum | null
  sharedDrives: {
    id: string
    residentialFolderId: string
    commercialFolderId: string
  }[]
  projectFolders: {
    id: string
    sharedDriveId: string
  }[]
}
export type UpdateGoogleProjectFoldersResponse = {
  message: string
  data: UpdateGoogleProjectFoldersResponseData
}
export type UpdateGoogleProjectFoldersResponseData = {
  updatedProjectInfos: {
    updateField: 'name' | 'propertyType'
    projectFolderId: string
    data:
      | {
          originalName: string
          updatedName: string
        }
      | {
          origanalPropertyTypeFolderId: string
          movedPropertyTypeFolderId: string
        }
  }[]
}

/**
 * RollbackUpdateProjectFolders
 */
export type RollbackUpdateProjectFoldersRequestPayload = {
  updatedProjectInfos: {
    updateField: 'name' | 'propertyType'
    projectFolderId: string
    data:
      | {
          originalName: string
          updatedName: string
        }
      | {
          origanalPropertyTypeFolderId: string
          movedPropertyTypeFolderId: string
        }
  }[]
}
export type RollbackUpdateProjectFoldersResponse = {
  message: string
  data: null
}

/**
 * AhjNote
 */
export type CreateAhjNoteFolderData = {
  operation: 'create-ahj'
  data: {
    createName: string
    geoId: string
  }
}
export type UpdateAhjNoteFolderData = {
  operation: 'update-ahj'
  data: {
    folderId: string | null
    updateName: string
    geoId: string
  }
}
export type AhjNoteFolderData = CreateAhjNoteFolderData | UpdateAhjNoteFolderData

/**
 * AhjNoteFolderOperationResult
 */
export type CreateAhjNoteFolderOperationResult = {
  operation: 'create-ahj'
  id: string
  name: string
  matchedExistingData: boolean
  geoId: string
}
export type UpdateAhjNoteFolderOperationResult = {
  operation: 'update-ahj'
  id: string
  name: string
  nameBeforeUpdate: string | null
  matchedExistingData: boolean
  geoId: string
}
export type AhjNoteFolderOperationResult = CreateAhjNoteFolderOperationResult | UpdateAhjNoteFolderOperationResult

/**
 * CreateOrUpdateAhjNoteFolders
 */
export type CreateOrUpdateAhjNoteFoldersRequestPayload = {
  ahjNoteFolderDatas: AhjNoteFolderData[]
}
export type CreateOrUpdateAhjNoteFoldersResponse = {
  message: string
  data: CreateOrUpdateAhjNoteFoldersResponseData
}
export type CreateOrUpdateAhjNoteFoldersResponseData = {
  ahjNoteFolderOperationResults: AhjNoteFolderOperationResult[]
}

/**
 * RollbackCreateOrUpdateAhjNoteFolders
 */
export type RollbackCreateOrUpdateAhjNoteFoldersRequestPayload = {
  ahjNoteFolderOperationResults: AhjNoteFolderOperationResult[]
}
export type RollbackCreateOrUpdateAhjNoteFoldersResponse = {
  message: string
  data: null
}

/**
 * DeleteItemsInSharedDrive
 */
export type DeleteItemsInSharedDriveRequestPayload = {
  sharedDrive: {
    id: string
    delete: boolean
  }
  itemIds: string[]
}
