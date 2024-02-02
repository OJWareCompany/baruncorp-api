/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import {
  CreateGoogleJobFolderResponseData,
  CreateGoogleProjectFolderResponseData,
  CreateGoogleSharedDriveResponseData,
  UpdateGoogleProjectFoldersResponseData,
} from '../../infra/filesystem.api.type'
import { FilesystemApiService } from '../../infra/filesystem.api.service'
import { GoogleDriveProjectFolderNotFoundException, GoogleDriveSharedDriveNotFoundException } from '../filesystem.error'
import { DataIntegrityException } from '../../../../app.error'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { GoogleJobFolder, GoogleProjectFolder, GoogleSharedDrive } from '@prisma/client'

@Injectable()
export class FilesystemDomainService {
  constructor(
    private readonly filesystemApiService: FilesystemApiService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * create Job Folder
   */
  async createGoogleJobFolder(
    projectId: string,
    projectPropertyType: string,
    projectFullAddress: string,
    jobId: string,
    projectTotalOfJobs: number,
  ): Promise<{
    googleJobFolderData: GoogleJobFolder
    rollback: () => Promise<void>
  }> {
    const projectFolders = await this.prismaService.googleProjectFolder.findMany({
      where: { projectId: projectId },
    })
    if (projectFolders.length === 0) {
      throw new GoogleDriveProjectFolderNotFoundException()
    }

    /**
     * 프로젝트 폴더가 포함된 공유 드라이브 중에 최고 버전의 공유 드라이브 조회
     */
    const sharedDriveIdsRelatedToProject = projectFolders.map((pf) => pf.sharedDriveId as string)
    const highVerSharedDriveRelatedToProject = await this.prismaService.googleSharedDrive.findFirst({
      where: { id: { in: sharedDriveIdsRelatedToProject } },
      orderBy: { version: 'desc' },
    })
    if (!highVerSharedDriveRelatedToProject) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    const highVerSharedDriveRelatedToOrganizationId = await this.prismaService.googleSharedDrive.findFirst({
      where: { organizationId: highVerSharedDriveRelatedToProject.organizationId },
      orderBy: { version: 'desc' },
    })
    if (!highVerSharedDriveRelatedToOrganizationId) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    /**
     * 프로젝트와 관련있는 프로젝트 폴더 중에서 가장 공유 드라이브 버전이 높은게 있는가?
     */
    let projectFolder
    if (highVerSharedDriveRelatedToProject.id !== highVerSharedDriveRelatedToOrganizationId.id) {
      const propertyTypeFolderId =
        projectPropertyType === 'Residential'
          ? highVerSharedDriveRelatedToOrganizationId.residentialFolderId
          : highVerSharedDriveRelatedToOrganizationId.commercialFolderId
      if (!propertyTypeFolderId) {
        throw new DataIntegrityException(
          `Invalid propertyTypeFolderId. Check record of google_shared_drive table with '${highVerSharedDriveRelatedToOrganizationId.id}' id`,
        )
      }

      const createProjectFolderResponseData = await this.filesystemApiService.requestToCreateProjectFolder({
        sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id,
        propertyTypeFolderId: propertyTypeFolderId,
        projectName: projectFullAddress,
      })
      projectFolder = createProjectFolderResponseData.projectFolder
      await this.prismaService.googleProjectFolder.create({
        data: {
          id: projectFolder.id,
          shareLink: projectFolder.shareLink,
          projectId: projectId,
          sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id,
        },
      })
    } else {
      projectFolder = projectFolders.find((pf) => pf.sharedDriveId === highVerSharedDriveRelatedToProject.id)
    }
    if (!projectFolder) {
      throw new GoogleDriveProjectFolderNotFoundException()
    }

    const createJobFolderResponseData = await this.filesystemApiService.requestToCreateJobFolder({
      sharedDriveId: highVerSharedDriveRelatedToProject.id,
      projectFolderId: projectFolder.id,
      jobName: `Job ${projectTotalOfJobs + 1}`,
    })

    const { jobFolder, deliverablesFolder, jobNotesFolder } = createJobFolderResponseData
    return {
      googleJobFolderData: {
        id: jobFolder.id,
        shareLink: jobFolder.shareLink,
        deliverablesFolderId: deliverablesFolder.id,
        deliverablesFolderShareLink: deliverablesFolder.shareLink,
        jobId,
        jobNotesFolderId: jobNotesFolder.id,
        jobNotesFolderShareLink: jobNotesFolder.shareLink,
        sharedDriveId: highVerSharedDriveRelatedToProject.id,
        count: 0,
      },
      rollback: async () => {
        await this.rollbackCreateGoogleJobFolder(highVerSharedDriveRelatedToProject.id, createJobFolderResponseData)
      },
    }
  }

  /**
   * Rollback Update Project Folder
   */
  private async rollbackUpdateGoogleProjectFolder(
    updateProjectFoldersResponseData: UpdateGoogleProjectFoldersResponseData,
  ) {
    await this.filesystemApiService.requestToRollbackUpdateProjectFolders({
      updatedProjectInfos: updateProjectFoldersResponseData.updatedProjectInfos,
    })
  }

  /**
   * Update Project Folders
   */
  async updateGoogleProjectFolders({
    organizationId,
    projectId,
    toProjectFolderName,
    toProjectPropertyType,
    needUpdateProjectName,
    needUpdateProjectPropertyType,
  }: {
    organizationId: string
    projectId: string
    toProjectFolderName: string
    toProjectPropertyType: ProjectPropertyTypeEnum
    needUpdateProjectName: boolean
    needUpdateProjectPropertyType: boolean
  }): Promise<{
    rollback: null | (() => Promise<void>)
  }> {
    if (!needUpdateProjectName && !needUpdateProjectPropertyType) {
      return { rollback: null }
    }

    const projectFolders = await this.prismaService.googleProjectFolder.findMany({
      where: { projectId },
    })
    if (projectFolders.length === 0) throw new GoogleDriveProjectFolderNotFoundException()

    const sharedDrives = await this.prismaService.googleSharedDrive.findMany({
      where: { organizationId: organizationId },
    })
    if (sharedDrives.length === 0) throw new GoogleDriveSharedDriveNotFoundException()

    /**
     * validation
     */
    projectFolders.forEach((pf) => {
      const filtered = sharedDrives.filter((sd) => sd.id === pf.sharedDriveId)
      if (filtered.length !== 1) {
        throw new DataIntegrityException('ProjectFolderRecord must have one data retrieved with sharedDriveId')
      }
    })

    /**
     * 추후 domain service로 리팩토링..
     * 데이터 마이그레이션이 정상적으로 안됏을 때를 가정해서 데이터 알아서 채워주는 로직
     */
    for (const sd of sharedDrives) {
      if (!sd.residentialFolderId || !sd.commercialFolderId) {
        const { residentialFolder, commercialFolder } = await this.filesystemApiService.requestToGetPropertyTypeFolder(
          sd.id,
        )
        await this.prismaService.googleSharedDrive.update({
          where: { id: sd.id },
          data: {
            residentialFolderId: residentialFolder.id,
            commercialFolderId: commercialFolder.id,
          },
        })
        sd.residentialFolderId = residentialFolder.id
        sd.commercialFolderId = commercialFolder.id
      }
    }

    /**
     * 추후 domain service로 리팩토링..
     * 데이터 마이그레이션이 정상적으로 안됏을 때를 가정해서 데이터 알아서 채워주는 로직
     */
    for (const pf of projectFolders) {
      if (!pf.sharedDriveId) {
        const { sharedDriveId } = await this.filesystemApiService.requestToGetSharedDriveIdByFolderId(pf.id)
        await this.prismaService.googleProjectFolder.update({
          where: { id: pf.id },
          data: { sharedDriveId },
        })
        pf.sharedDriveId = sharedDriveId
      }
    }

    const payload = {
      needUpdateProjectName,
      toProjectFolderName: needUpdateProjectName ? toProjectFolderName : null,
      needUpdateProjectPropertyType,
      toProjectPropertyType: needUpdateProjectPropertyType ? toProjectPropertyType : null,
      sharedDrives: sharedDrives.map((sd) => {
        return {
          id: sd.id,
          residentialFolderId: sd.residentialFolderId as string,
          commercialFolderId: sd.commercialFolderId as string,
        }
      }),
      projectFolders: projectFolders.map((pf) => {
        return {
          id: pf.id,
          sharedDriveId: pf.sharedDriveId as string,
        }
      }),
    }

    const updateProjectFoldersResponseData = await this.filesystemApiService.requestToUpdateProjectFolders(payload)

    return {
      rollback: async () => {
        await this.rollbackUpdateGoogleProjectFolder(updateProjectFoldersResponseData)
      },
    }
  }

  /**
   * create Project Folder
   */
  async createGoogleProjectFolder(
    organizationId: string,
    projectId: string,
    projectPropertyType: string,
    projectFullAddress: string,
  ): Promise<{
    googleProjectFolderData: GoogleProjectFolder
    rollback: () => Promise<void>
  }> {
    const highVerSharedDrive = await this.prismaService.googleSharedDrive.findFirst({
      where: { organizationId },
      orderBy: { version: 'desc' },
    })
    if (!highVerSharedDrive) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    const propertyTypeFolderId =
      projectPropertyType === 'Residential'
        ? highVerSharedDrive.residentialFolderId
        : highVerSharedDrive.commercialFolderId
    if (!propertyTypeFolderId) {
      throw new DataIntegrityException(
        `Invalid propertyTypeFolderId. Check record of google_shared_drive table with '${highVerSharedDrive.id}' id`,
      )
    }

    const createProjectFolderResponseData = await this.filesystemApiService.requestToCreateProjectFolder({
      sharedDriveId: highVerSharedDrive.id,
      propertyTypeFolderId: propertyTypeFolderId,
      projectName: projectFullAddress,
    })

    return {
      googleProjectFolderData: {
        id: createProjectFolderResponseData.projectFolder.id,
        shareLink: createProjectFolderResponseData.projectFolder.shareLink,
        projectId,
        sharedDriveId: highVerSharedDrive.id,
      },
      rollback: async () => {
        await this.rollbackCreateGoogleProjectFolder(highVerSharedDrive.id, createProjectFolderResponseData)
      },
    }
  }

  /**
   * Rollback Create Job Folder
   */
  private async rollbackCreateGoogleJobFolder(
    sharedDriveId: string,
    createJobFolderResponseData: CreateGoogleJobFolderResponseData,
  ) {
    const { jobFolder, deliverablesFolder, jobNotesFolder } = createJobFolderResponseData
    const itemIds = []
    if (!deliverablesFolder.matchedExistingData) itemIds.push(deliverablesFolder.id)
    if (!jobFolder.matchedExistingData) itemIds.push(jobFolder.id)
    if (!jobNotesFolder.matchedExistingData) itemIds.push(jobNotesFolder.id)
    if (itemIds.length > 0) {
      await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
        sharedDrive: {
          id: sharedDriveId,
          delete: false,
        },
        itemIds,
      })
    }
  }

  /**
   * Rollback Create Project Folder
   */
  private async rollbackCreateGoogleProjectFolder(
    sharedDriveId: string,
    createProjectFolderResponseData: CreateGoogleProjectFolderResponseData,
  ) {
    const projectFolder = createProjectFolderResponseData.projectFolder
    if (!projectFolder.matchedExistingData) {
      await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
        sharedDrive: {
          id: sharedDriveId,
          delete: false,
        },
        itemIds: [projectFolder.id],
      })
    }
  }

  /**
   * Create Firsts Version Google Shared Drive
   */
  async createFirstVersionGoogleSharedDrive(
    organizationId: string,
    organizationName: string,
  ): Promise<{
    googleSharedDriveData: GoogleSharedDrive
    rollback: () => Promise<void>
  }> {
    const createGoogleSharedDriveResponseData = await this.filesystemApiService.requestToCreateGoogleSharedDrive(
      organizationName,
    )
    const { sharedDrive, residentialFolder, commercialFolder } = createGoogleSharedDriveResponseData
    return {
      googleSharedDriveData: {
        id: sharedDrive.id,
        residentialFolderId: residentialFolder.id,
        commercialFolderId: commercialFolder.id,
        organizationId: organizationId,
        organizationName: organizationName,
        count: 0,
        version: '001',
      },
      rollback: async () => {
        await this.rollbackCreateGoogleSharedDrive(createGoogleSharedDriveResponseData)
      },
    }
  }

  /**
   * Rollback Create Firsts Version Google Shared Drive
   */
  private async rollbackCreateGoogleSharedDrive(createSharedDriveResponseData: CreateGoogleSharedDriveResponseData) {
    const { sharedDrive, residentialFolder, commercialFolder } = createSharedDriveResponseData
    const itemIds = []
    if (!residentialFolder.matchedExistingData) itemIds.push(residentialFolder.id)
    if (!commercialFolder.matchedExistingData) itemIds.push(commercialFolder.id)
    await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
      sharedDrive: {
        id: sharedDrive.id,
        delete: !sharedDrive.matchedExistingData,
      },
      itemIds,
    })
  }

  // needUpdateProjectFolder({
  //   fromProjectFolderName,
  //   toProjectFolderName,
  //   fromProjectPropertyType,
  //   toProjectPropertyType,
  // }: {
  //   fromProjectFolderName: string
  //   toProjectFolderName: string
  //   fromProjectPropertyType: ProjectPropertyTypeEnum
  //   toProjectPropertyType: ProjectPropertyTypeEnum
  // }): boolean {
  //   const needUpdateProjectName = toProjectFolderName !== fromProjectFolderName
  //   const needUpdateProjectPropertyType = toProjectPropertyType !== fromProjectPropertyType
  //   return needUpdateProjectName || needUpdateProjectPropertyType
  // }
}
