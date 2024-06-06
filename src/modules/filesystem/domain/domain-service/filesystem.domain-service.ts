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
   * jobFolder 카운팅을 정상적으로 한 케이스
   * - googleJobFolder의 count 값 수정
   * - googleSharedDrive이 count 값 +count로 수정
   */
  async reflectGoogleJobFolderCountingResult({
    jobFolderId,
    sharedDriveId,
    count,
  }: {
    jobFolderId: string
    sharedDriveId: string
    count: number
  }) {
    const jobFolder = await this.prismaService.googleJobFolder.findFirstOrThrow({ where: { id: jobFolderId } })
    const jobFolderCount = jobFolder.count ?? 0
    // resend이고 이미 값이 제대로 기록되있는 경우는 Early Return
    if (jobFolderCount > 0) return
    /**
     * `(jobFolderCount === -1)`는 이전에 계산 과정에서 에러가 발생해서 공유 드라이브에 임의 값인 100이 계산되었다는 의미
     * 그러므로 이 경우엔 (-100 + count) 값을 increment로 해줌
     *   - count가 24인 경우 => -76이 적용
     *   - count가 176인 경우 => +76이 적용
     */
    const sharedDriveCountIncrement = jobFolderCount === -1 ? -100 + count : count
    await this.prismaService.googleJobFolder.update({
      where: { id: jobFolderId },
      data: { count },
    })
    await this.prismaService.googleSharedDrive.update({
      where: { id: sharedDriveId },
      data: { count: { increment: sharedDriveCountIncrement } },
    })
  }

  /**
   * jobFolder 카운팅 하다가 에러가 발생한 케이스
   * - googleJobFolder의 count 값 -1로 수정
   *   - 에러가 발생했단걸 표시하기 위함
   * - googleSharedDrive이 count 값 +100로 수정
   *   - 에러인 경우 sharedDrive에 임의로 +100개 카운팅
   */
  async reflectGoogleJobFolderCountingError({
    jobFolderId,
    sharedDriveId,
  }: {
    jobFolderId: string
    sharedDriveId: string
  }) {
    await this.prismaService.googleJobFolder.update({
      where: { id: jobFolderId },
      data: { count: -1 },
    })
    await this.prismaService.googleSharedDrive.update({
      where: { id: sharedDriveId! },
      data: { count: { increment: 100 } },
    })
  }

  /**
   * 다음 버전의 공유 드라이브 생성
   * Example) 'GreenLancer 003' => 'GreenLancer 004'
   */
  async upgradeSharedDriveVersion({
    currentSharedDriveId,
    version,
    organizationId,
    organizationName,
  }: {
    currentSharedDriveId: string
    version: string
    organizationId: string
    organizationName: string
  }) {
    const nextSharedDriveVersion = String(parseInt(version) + 1).padStart(3, '0')
    const nextSharedDriveName = `${organizationName} ${nextSharedDriveVersion}`

    const createGoogleSharedDriveResponseData = await this.filesystemApiService.requestToCreateGoogleSharedDrive(
      nextSharedDriveName,
    )
    const {
      sharedDrive: newVersionSharedDrive,
      residentialFolder: newVersionResidentialFolder,
      commercialFolder: newVersionCommercialFolder,
    } = createGoogleSharedDriveResponseData

    // 이미 존재하는 공유 드라이브면 return (다른 API 요청에 의해 이미 Next Version Shared Drive가 만들어진 경우임)
    if (newVersionSharedDrive.matchedExistingData) return

    try {
      await this.prismaService.$transaction([
        this.prismaService.googleSharedDrive.update({
          where: { id: currentSharedDriveId },
          data: { isHighestVersion: false },
        }),
        this.prismaService.googleSharedDrive.create({
          data: {
            id: newVersionSharedDrive.id,
            residentialFolderId: newVersionResidentialFolder.id,
            commercialFolderId: newVersionCommercialFolder.id,
            organizationId: organizationId,
            organizationName: organizationName,
            count: 0,
            version: nextSharedDriveVersion,
            isHighestVersion: true,
          },
        }),
      ])
    } catch (error) {
      /**
       * 실패 시 생성한 newVersionSharedDrive 제거해야 함
       */
      await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
        sharedDrive: {
          id: newVersionSharedDrive.id,
          delete: true,
        },
        itemIds: [newVersionResidentialFolder.id, newVersionCommercialFolder.id],
      })
      throw error
    }
  }

  /**
   * create Job Folder
   */
  async createGoogleJobFolder(
    organizationId: string,
    projectId: string,
    projectPropertyType: ProjectPropertyTypeEnum,
    projectFullAddress: string,
    jobId: string,
    projectTotalOfJobs: number,
  ): Promise<{
    googleJobFolderData: GoogleJobFolder
    rollback: () => Promise<void>
  }> {
    /**
     * 1-1)
     * projectId와 관련 있는 projectFolder들 조회
     */
    const projectFolders = await this.prismaService.googleProjectFolder.findMany({
      where: { projectId: projectId },
    })
    if (projectFolders.length === 0) {
      throw new GoogleDriveProjectFolderNotFoundException()
    }

    /**
     * 1-2)
     * projectFolder들의 sharedDriveId들 조회
     */
    const sharedDriveIdsRelatedToProjectId = projectFolders.map((pf) => pf.sharedDriveId as string)

    /**
     * 1-3)
     * sharedDriveIds들 중에 가장 version이 높은 sharedDrive 조회
     */
    const highVerSharedDriveRelatedToProjectId = await this.prismaService.googleSharedDrive.findFirst({
      where: { id: { in: sharedDriveIdsRelatedToProjectId } },
      orderBy: { version: 'desc' },
    })
    if (!highVerSharedDriveRelatedToProjectId) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    /**
     * 2)
     * organizationId와 관련 있는 sharedDrive 중에 가장 버전이 높은 sharedDrive
     */
    const highVerSharedDriveRelatedToOrganizationId = await this.prismaService.googleSharedDrive.findFirst({
      where: { organizationId },
      orderBy: { version: 'desc' },
    })
    if (!highVerSharedDriveRelatedToOrganizationId) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    /**
     * 아래 코드로 진행하기 전에 위 과정에 대한 설명 필요
     * @description 1-1, 1-2, 1-3, 2번 과정을 거친 이유
     * - 'FV'라는 조직이 있다고 가정
     * - 'FV'는 001, 002, 003 버전의 공유 드라이브를 가지고 있다고 가정
     *  - 새로운 Job은 무조건 003 버전의 공유 드라이브에 생성돼야 함
     * - 사용자가 주문한 Job을 'A'라는 프로젝트 폴더 아래에 만들어야 하는 상황
     * - 001, 002 버전의 공유 드라이브에는 'A'라는 프로젝트 폴더가 있을지 모르나, 003 버전의 공유 드라이브에는 'A'라는 프로젝트 폴더가 있을 거란 보장이 없음
     * - 주문된 Job은 003 공유 드라이브에 생성돼야 하기 때문에 'A' 프로젝트 폴더가 003 버전의 공유 드라이브에 생겨야 한다
     * - 위 과정은 003 버전 공유 드라이브에 'A' 프로젝트를 만들어야 하냐 마냐를 판별하기 위한 사전 작업임
     */

    /**
     * 프로젝트와 관련있는 프로젝트 폴더 중에서 가장 공유 드라이브 버전이 높은게 있는가?
     */
    let projectFolder = null
    if (highVerSharedDriveRelatedToProjectId.id !== highVerSharedDriveRelatedToOrganizationId.id) {
      /**
       * ----------------------------------------
       * Project Folder를 새로 만들어야 하는 케이스    |
       * ----------------------------------------
       */

      /**
       * @description
       * highVerSharedDriveRelatedToProjectId이 아닌 highVerSharedDriveRelatedToOrganizationId로 부터
       * residentialFolderId, commercialFolderId을 가져오는 이유는??
       * 003 버전에 Job이 생성되야 하는 Job이 생성되야 하는 상위 폴더인 프로젝트 폴더가
       * 003 버전 공유 드라이브에 존재하지 않기 때문에 새로 만들어야 함
       */
      const { residentialFolderId, commercialFolderId } = highVerSharedDriveRelatedToOrganizationId
      // TODO 데이터베이스 수정 필요. 시스템 상 Null이 될 수가 없음.
      const propertyTypeFolderId = (
        projectPropertyType === 'Residential' ? residentialFolderId : commercialFolderId
      ) as string

      const createProjectFolderResponseData = await this.filesystemApiService.requestToCreateProjectFolder({
        sharedDriveName: highVerSharedDriveRelatedToOrganizationId.organizationName,
        sharedDriveVersion: highVerSharedDriveRelatedToOrganizationId.version as string, // TODO DB 수정해야 함. 시스템 상 Null이 될 수가 없음
        sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id,
        propertyType: projectPropertyType,
        propertyTypeFolderId: propertyTypeFolderId,
        projectName: projectFullAddress,
      })

      const googleProjectFolderData = {
        id: createProjectFolderResponseData.projectFolder.id,
        shareLink: createProjectFolderResponseData.projectFolder.shareLink,
        parentless: createProjectFolderResponseData.projectFolder.parentless,
        projectId,
        sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id,
      }

      await this.prismaService.googleProjectFolder.create({ data: googleProjectFolderData })

      projectFolder = googleProjectFolderData
    } else {
      /**
       * ---------------------------------------------------------------------
       * Project Folder가 가장 버전이 높은 공유 드라이브에도 존재해서 만들 필요 없는 경우    |
       * ---------------------------------------------------------------------
       */
      projectFolder = projectFolders.find((pf) => pf.sharedDriveId === highVerSharedDriveRelatedToProjectId.id)
    }
    /**
     * @TODO
     * 사실 시스템 상으로 projectFolder가 안만들어질 수가 없는데 일단 방어적으로 코드 작성
     * 좀 더 세부적으로 예외 처리 해야 하는 것 아닌지??
     */
    if (!projectFolder) {
      throw new GoogleDriveProjectFolderNotFoundException()
    }

    const createJobFolderResponseData = await this.filesystemApiService.requestToCreateJobFolder({
      sharedDriveName: highVerSharedDriveRelatedToOrganizationId.organizationName,
      sharedDriveVersion: highVerSharedDriveRelatedToOrganizationId.version as string, // TODO DB 수정해야 함. 시스템 상 Null이 될 수가 없음,
      sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id, // 과거에 왜 highVerSharedDriveRelatedToProjectId를 사용했지??
      propertyType: projectPropertyType,
      projectName: projectFullAddress,
      projectFolderId: projectFolder.id,
      jobName: `Job ${projectTotalOfJobs + 1}`,
      // project folder가 parentless => job folder도 parentless
      parentlessProjectFolder: projectFolder.parentless as boolean, // TODO DB 수정해야 함. 시스템 상 Null이 될 수가 없음,
    })

    const { jobFolder, deliverablesFolder, jobNotesFolder } = createJobFolderResponseData
    return {
      googleJobFolderData: {
        id: jobFolder.id,
        shareLink: jobFolder.shareLink,
        parentless: jobFolder.parentless,
        deliverablesFolderId: deliverablesFolder.id,
        deliverablesFolderShareLink: deliverablesFolder.shareLink,
        jobId,
        jobNotesFolderId: jobNotesFolder.id,
        jobNotesFolderShareLink: jobNotesFolder.shareLink,
        sharedDriveId: highVerSharedDriveRelatedToOrganizationId.id,
        count: 0,
        projectId,
      },
      rollback: async () => {
        await this.rollbackCreateGoogleJobFolder(
          highVerSharedDriveRelatedToOrganizationId.id,
          createJobFolderResponseData,
        )
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
    projectPropertyType: ProjectPropertyTypeEnum,
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

    // TODO 데이터베이스 수정 필요. 시스템 상 Null이 될 수가 없음.
    const propertyTypeFolderId = (
      projectPropertyType === 'Residential'
        ? highVerSharedDrive.residentialFolderId
        : highVerSharedDrive.commercialFolderId
    ) as string

    const createProjectFolderResponseData = await this.filesystemApiService.requestToCreateProjectFolder({
      sharedDriveName: highVerSharedDrive.organizationName,
      // TODO: highVerSharedDrive.version은 무조건 string, 데이터베이스 필드 null될 수 없도록 수정할 것
      sharedDriveVersion: highVerSharedDrive.version as string,
      sharedDriveId: highVerSharedDrive.id,
      propertyType: projectPropertyType,
      propertyTypeFolderId: propertyTypeFolderId,
      projectName: projectFullAddress,
    })

    return {
      googleProjectFolderData: {
        id: createProjectFolderResponseData.projectFolder.id,
        shareLink: createProjectFolderResponseData.projectFolder.shareLink,
        parentless: createProjectFolderResponseData.projectFolder.parentless,
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
        isHighestVersion: true,
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
