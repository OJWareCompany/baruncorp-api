import { ProjectPropertyType } from '@src/modules/project/domain/project.type'

export class ProjectResponseDto {
  projectId: string
  propertyType: ProjectPropertyType
  projectNumber: string | null
  propertyAddress: string
  systemSize: number | null
  isGroundMount: boolean
  projectPropertyOwnerName: string
  clientOrganization: string
  clientOrganizationId: string
  clientUserId: string
  clientUserName: string
  projectFolderLink: string | null
  mailingAddressForWetStamp: string
  numberOfWetStamp: string | null
}
