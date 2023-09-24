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
import { getQueryHttpControllerContent } from './query-format/http.controller.format.mjs'
import { getQueryHandlerContent } from './query-format/query-handler.format.mjs'
import { getQueryRequestDtoContent } from './query-format/request.dto.format.mjs'

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
  .argument('<string>', 'folder name')
  .action((str, options) => {
    const folderName = str
    const folderPath = path.join(__dirname, folderName)

    try {
      // 폴더 생성
      fs.ensureDirSync(folderPath)
      console.log(`Created ${folderName} folder`)

      // 각 파일 생성 및 내용 작성
      createFileWithFormat(folderPath, `${folderName}.http.controller.ts`, getHttpControllerContent(folderName))
      createFileWithFormat(folderPath, `${folderName}.service.ts`, getServiceContent(folderName))
      createFileWithFormat(folderPath, `${folderName}.command.ts`, getCommandContent(folderName))
      createFileWithFormat(folderPath, `${folderName}.request.dto.ts`, getRequestDtoContent(folderName))
    } catch (error) {
      console.error('Error:', error.message)
    }
  })

program
  .command('query')
  .argument('<string>', 'folder name')
  .action((str, options) => {
    const folderName = str
    const folderPath = path.join(__dirname, folderName)

    try {
      // 폴더 생성
      fs.ensureDirSync(folderPath)
      console.log(`Created ${folderName} folder`)

      // 각 파일 생성 및 내용 작성
      createFileWithFormat(folderPath, `${folderName}.http.controller.ts`, getQueryHttpControllerContent(folderName))
      createFileWithFormat(folderPath, `${folderName}.query-handler.ts`, getQueryHandlerContent(folderName))
      createFileWithFormat(folderPath, `${folderName}.request.dto.ts`, getQueryRequestDtoContent(folderName))
    } catch (error) {
      console.error('Error:', error.message)
    }
  })

program.parse()

// 명령어 라인 인자가 없는 경우 도움말 표시
if (process.argv.length <= 2) {
  program.help()
}
