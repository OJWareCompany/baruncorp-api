#!/usr/bin/env node
import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url' // import 추가
import { createFileWithFormat } from './util/create-file-with-format.mjs'
import { getCommandContent } from './command-format/command.format.mjs'
import { getHttpControllerContent } from './command-format/http.controller.format.mjs'
import { getRequestDtoContent } from './command-format/request.dto.format.mjs'
import { getServiceContent } from './command-format/service.format.mjs'
import { getUpdateCommand } from './command-format/update-service.command.format.mjs'
import { getRequestParamDtoContent } from './command-format/request.param.dto.format.mjs'
import { getUpdateHttpControllerContent } from './command-format/update-http.controller.format.mjs'
import { getQueryHttpControllerContent } from './query-format/http.controller.format.mjs'
import { getQueryHandlerContent } from './query-format/query-handler.format.mjs'
import { getQueryRequestDtoContent } from './query-format/request.dto.format.mjs'
import { getQueryResponseDtoContent } from './query-format/response.dto.format.mjs'
import { getMapperFormat } from './domain-format/mapper.format.mjs'
import { getModuleFormat } from './domain-format/module.format.mjs'
import { getDITokenFormat } from './domain-format/di-token.format.mjs'
import { getRepositoryFormat } from './domain-format/repository.format.mjs'
import { getRepositoryPortFormat } from './domain-format/repository.port.format.mjs'
import { getEntityFormat } from './domain-format/entity.format.mjs'
import { getEntityTypeFormat } from './domain-format/entity.type.format.mjs'
import { getDomainErrorFormat } from './domain-format/entity.error.mjs'
import { getPaginatedQueryHttpControllerContent } from './query-format/paginated-query/paginated.http.controller.format.mjs'
import { getPaginatedQueryHandlerContent } from './query-format/paginated-query/paginated.query-handler.format.mjs'
import { getPaginatedQueryResponseDtoContent } from './query-format/paginated-query/paginated.response.dto.format.mjs'
import { getPaginatedQueryRequestDtoContent } from './query-format/paginated-query/paginated.request.dto.format.mjs'

// 현재 모듈의 파일 경로를 얻기 위한 함수
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()

// CLI 도구 버전 및 설명 설정
program //
  .name('make cqrs files.')
  .version('1.0.0')
  .description('Custom CLI Tool for File Generation')

program
  .command('command')
  .argument('<string>', 'domain name')
  .action((str, options) => {
    const domainName = str
    const createPath = path.join(__dirname, 'commands', `create-${domainName}`)
    const updatePath = path.join(__dirname, 'commands', `update-${domainName}`)
    const deletePath = path.join(__dirname, 'commands', `delete-${domainName}`)

    const createFolderName = `create-${domainName}`
    const updateFolderName = `update-${domainName}`
    const deleteFolderName = `delete-${domainName}`

    try {
      // 폴더 생성
      fs.ensureDirSync(createPath)
      fs.ensureDirSync(updatePath)
      fs.ensureDirSync(deletePath)
      console.log(`Created ${domainName} folder`)

      // create
      makeCommandFiles(createPath, createFolderName, domainName, 'POST')

      // update
      makeCommandFiles(updatePath, updateFolderName, domainName, 'PATCH')

      // delete
      makeCommandFiles(deletePath, deleteFolderName, domainName, 'DELETE')
    } catch (error) {
      console.error('Error:', error.message)
    }
  })

program
  .command('query')
  .argument('<string>', 'domain name')
  .action((str, options) => {
    const domainName = str
    const folderName = `find-` + str
    const folderPath = path.join(__dirname, 'queries', folderName)

    const paginatedFolderName = `find-` + str + `-paginated`
    const paginatedFolderPath = path.join(__dirname, 'queries', paginatedFolderName)

    try {
      // 폴더 생성
      fs.ensureDirSync(folderPath)
      fs.ensureDirSync(paginatedFolderPath)

      console.log(`Created ${folderName} folder`)

      // 각 파일 생성 및 내용 작성
      makeQueryFiles(folderPath, folderName, domainName)
      makePaginatedQueryFiles(paginatedFolderPath, paginatedFolderName, domainName)
    } catch (error) {
      console.error('Error:', error.message)
    }
  })

program
  .command('init')
  .argument('<string>', 'domain name')
  .action((str, options) => {
    const domainName = str
    const rootFolder = path.join(__dirname, '../src/modules')

    const domainRootFolderPath = path.join(rootFolder, domainName)
    const commandFolderPath = path.join(rootFolder, domainName, 'commands')
    const databaseFolderPath = path.join(rootFolder, domainName, 'database')
    const domainFolderPath = path.join(rootFolder, domainName, 'domain')
    const dtosFolderPath = path.join(rootFolder, domainName, 'dtos')
    const queriesFolderPath = path.join(rootFolder, domainName, 'queries')

    // Commands
    const createPath = path.join(rootFolder, domainName, 'commands', `create-${domainName}`)
    const updatePath = path.join(rootFolder, domainName, 'commands', `update-${domainName}`)
    const deletePath = path.join(rootFolder, domainName, 'commands', `delete-${domainName}`)
    const createFolderName = `create-${domainName}`
    const updateFolderName = `update-${domainName}`
    const deleteFolderName = `delete-${domainName}`

    // Queries
    const folderName = `find-` + str
    const queryFolderPath = path.join(rootFolder, domainName, 'queries', folderName)
    const paginatedFolderName = `find-` + str + `-paginated`
    const paginatedFolderPath = path.join(rootFolder, domainName, 'queries', paginatedFolderName)

    try {
      // 폴더 생성
      fs.ensureDirSync(domainRootFolderPath)
      fs.ensureDirSync(commandFolderPath)
      fs.ensureDirSync(databaseFolderPath)
      fs.ensureDirSync(domainFolderPath)
      fs.ensureDirSync(dtosFolderPath)
      fs.ensureDirSync(queriesFolderPath)
      console.log(`Created ${domainName} folder`)

      // 각 파일 생성 및 내용 작성
      createFileWithFormat(
        domainRootFolderPath,
        `${domainName}.mapper.ts`,
        getMapperFormat(domainRootFolderPath, domainName),
      )
      createFileWithFormat(
        domainRootFolderPath,
        `${domainName}.module.ts`,
        getModuleFormat(domainRootFolderPath, domainName),
      )
      createFileWithFormat(
        domainRootFolderPath,
        `${domainName}.di-token.ts`,
        getDITokenFormat(domainRootFolderPath, domainName),
      )

      createFileWithFormat(domainFolderPath, `${domainName}.entity.ts`, getEntityFormat(domainFolderPath, domainName))
      createFileWithFormat(domainFolderPath, `${domainName}.type.ts`, getEntityTypeFormat(domainFolderPath, domainName))
      createFileWithFormat(
        domainFolderPath,
        `${domainName}.error.ts`,
        getDomainErrorFormat(domainFolderPath, domainName),
      )

      createFileWithFormat(
        databaseFolderPath,
        `${domainName}.repository.ts`,
        getRepositoryFormat(databaseFolderPath, domainName),
      )
      createFileWithFormat(
        databaseFolderPath,
        `${domainName}.repository.port.ts`,
        getRepositoryPortFormat(databaseFolderPath, domainName),
      )

      // Commands
      fs.ensureDirSync(createPath)
      fs.ensureDirSync(updatePath)
      fs.ensureDirSync(deletePath)
      console.log(`Created ${domainName} folder`)
      makeCommandFiles(createPath, createFolderName, domainName, 'POST')
      makeCommandFiles(updatePath, updateFolderName, domainName, 'PATCH')
      makeCommandFiles(deletePath, deleteFolderName, domainName, 'DELETE')

      // Queries
      fs.ensureDirSync(queryFolderPath)
      fs.ensureDirSync(paginatedFolderPath)
      console.log(`Created ${folderName} folder`)
      makeQueryFiles(queryFolderPath, folderName, domainName)
      makePaginatedQueryFiles(paginatedFolderPath, paginatedFolderName, domainName)
      console.log(domainName)
      // Dtos
      createFileWithFormat(
        dtosFolderPath,
        `${domainName}.response.dto.ts`,
        getQueryResponseDtoContent(folderName, domainName),
      )
      const responseDtoFileName = `${domainName}.paginated.response.dto.ts`
      createFileWithFormat(
        dtosFolderPath,
        responseDtoFileName,
        getPaginatedQueryResponseDtoContent(folderName, domainName),
      )
    } catch (error) {
      console.error('Error:', error.message)
    }
  })

program.parse()

// 명령어 라인 인자가 없는 경우 도움말 표시
if (process.argv.length <= 2) {
  program.help()
}

function makeCommandFiles(path, folderName, domainName, type) {
  const controller = `${folderName}.http.controller.ts`
  const service = `${folderName}.service.ts`

  if (type === 'PATCH' || type === 'DELETE') {
    createFileWithFormat(path, controller, getUpdateHttpControllerContent(folderName, domainName, type))
    createFileWithFormat(path, service, getUpdateCommand(folderName, domainName, type))
    createFileWithFormat(path, `${folderName}.request.dto.ts`, getRequestParamDtoContent(folderName, domainName, type))
  } else {
    createFileWithFormat(path, controller, getHttpControllerContent(folderName, domainName, type))
    createFileWithFormat(path, service, getServiceContent(folderName, domainName, type))
    createFileWithFormat(path, `${folderName}.request.dto.ts`, getRequestDtoContent(folderName, domainName, type))
  }
  createFileWithFormat(path, `${folderName}.command.ts`, getCommandContent(folderName, domainName, type))
}

function makeQueryFiles(path, folderName, domainName) {
  createFileWithFormat(path, `${folderName}.http.controller.ts`, getQueryHttpControllerContent(folderName, domainName))
  createFileWithFormat(path, `${folderName}.query-handler.ts`, getQueryHandlerContent(folderName, domainName))
  createFileWithFormat(path, `${folderName}.request.dto.ts`, getQueryRequestDtoContent(folderName, domainName))
}

function makePaginatedQueryFiles(path, folderName, domainName) {
  const controllerFileName = `find-${domainName}.paginated.http.controller.ts`
  const queryHandlerFileName = `find-${domainName}.paginated.query-handler.ts`
  const requestDtoFileName = `find-${domainName}.paginated.request.dto.ts`
  createFileWithFormat(path, controllerFileName, getPaginatedQueryHttpControllerContent(folderName, domainName))
  createFileWithFormat(path, queryHandlerFileName, getPaginatedQueryHandlerContent(folderName, domainName))
  createFileWithFormat(path, requestDtoFileName, getPaginatedQueryRequestDtoContent(folderName, domainName))
}
