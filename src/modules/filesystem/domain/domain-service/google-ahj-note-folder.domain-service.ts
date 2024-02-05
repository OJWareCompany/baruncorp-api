/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { GoogleAhjNotesFolder, Prisma } from '@prisma/client'
import { AhjNoteFolderData, AhjNoteFolderOperationResult } from '../../infra/filesystem.api.type'
import { PrismaService } from '../../../database/prisma.service'
import { FilesystemApiService } from '../../infra/filesystem.api.service'

type PrismaOperation = {
  name: string
  operation: Prisma.PrismaPromise<any>
}

@Injectable()
export class GoogleAhjNoteFolderDomainService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
  ) {}

  async createAhjNoteFolders(ahjNoteFolderDatas: AhjNoteFolderData[]) {
    const prismaOperations: PrismaOperation[] = []

    const { ahjNoteFolderOperationResults } = await this.filesystemApiService.requestToCreateOrUpdateAhjNoteFolders({
      ahjNoteFolderDatas,
    })
    for (const result of ahjNoteFolderOperationResults) {
      await this.addAhjNoteFolderOperation(result, prismaOperations)
    }

    try {
      const operations = prismaOperations.map((item) => item.operation)
      await this.prismaService.$transaction(operations)
    } catch (error) {
      await this.filesystemApiService.requestToRollbackCreateOrUpdateAhjNoteFolders({
        ahjNoteFolderOperationResults,
      })
      throw error
    }
  }

  private async addAhjNoteFolderOperation(
    ahjNoteFolderOperationResult: AhjNoteFolderOperationResult,
    prismaOperations: PrismaOperation[],
  ) {
    const existsByGeoId = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: {
        geoId: ahjNoteFolderOperationResult.geoId,
      },
    })
    if (existsByGeoId) {
      prismaOperations.push({
        name: 'updateAhjNotesFolder',
        operation: this.prismaService.$executeRaw<GoogleAhjNotesFolder>`
          UPDATE google_ahj_notes_folder 
          SET id = ${ahjNoteFolderOperationResult.id} 
          WHERE geo_id = ${ahjNoteFolderOperationResult.geoId}
        `,
      })
    } else {
      prismaOperations.push({
        name: 'createAhjNotesFolder',
        operation: this.prismaService.googleAhjNotesFolder.create({
          data: {
            id: ahjNoteFolderOperationResult.id,
            geoId: ahjNoteFolderOperationResult.geoId,
          },
        }),
      })
    }
  }

  /**
   * - state.stateLongName
   * - county.countyLongName
   * - countySubdivisions.longName
   * - place.placeLongName
   */
  async addAhjNoteFolderData(
    ahjNoteFolderDatas: AhjNoteFolderData[],
    {
      geoId,
      fullAhjName,
    }: {
      geoId: string
      fullAhjName: string
    },
  ): Promise<void> {
    const ahjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({ where: { geoId } })

    if (ahjNoteFolder && ahjNoteFolder.id) {
      ahjNoteFolderDatas.push({
        operation: 'update-ahj',
        data: {
          folderId: ahjNoteFolder.id,
          updateName: fullAhjName,
          geoId,
        },
      })
      return
    }

    ahjNoteFolderDatas.push({
      operation: 'create-ahj',
      data: {
        createName: fullAhjName,
        geoId: geoId,
      },
    })
  }
}
