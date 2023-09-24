import fs from 'fs-extra'
import path from 'path'

export function createFileWithFormat(folderPath, filename, content) {
  const filePath = path.join(folderPath, filename)
  fs.writeFileSync(filePath, content, 'utf-8')
}
