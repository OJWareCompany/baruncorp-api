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
 * DeleteItemsInSharedDrive
 */
export type DeleteItemsInSharedDriveRequestPayload = {
  sharedDrive: {
    id: string
    delete: boolean
  }
  itemIds: string[]
}
