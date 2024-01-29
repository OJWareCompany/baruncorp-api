import { GoogleJobNoteFolderEntity } from '../domain/google-job-note-folder.entity'

export interface GoogleJobNoteFolderRepositoryPort {
  insertOne(entity: GoogleJobNoteFolderEntity): Promise<void>
}
