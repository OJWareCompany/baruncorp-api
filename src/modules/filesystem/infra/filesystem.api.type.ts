/**
 * CreateGoogleProjectFolder
 */
export type CreateGoogleProjectFolderRequestPayload = {
  sharedDriveId: string
  residentailOrCommercialFolderId: string
  projectName: string
}
export type CreateGoogleProjectFolderResponseData = {
  projectFolder: {
    id: string
    name: string
    shareLink: string
    matchedExistingData: boolean
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
  sharedDriveId: string
  projectFolderId: string
  jobName: string
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
export type UpdateGoogleProjectFolderRequestPayload = {
  projectFolderId: string
  changeName: string | null
  changeTypeFolderId: string | null
}
export type UpdateGoogleProjectFolderResponse = {
  message: string
  data: UpdateGoogleProjectFolderResponseData
}
export type UpdateGoogleProjectFolderResponseData = {
  id: string
  changeNameInfo: null | {
    from: string
    to: string
  }
  changeTypeFolderIdInfo: null | {
    from: string
    to: string
  }
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
