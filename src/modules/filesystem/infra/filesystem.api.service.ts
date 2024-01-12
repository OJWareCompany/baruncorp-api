import { Injectable } from '@nestjs/common'
import got from 'got'

type CreateGoogleSharedDriveResponse = {
  message: string
  data: {
    sharedDrive: {
      id: string
      name: string
      path: string
    }
    residentialFolder: {
      id: string
      name: string
      sharedDriveId: string
      shareLink: string
      path: string
    }
    commercialFolder: {
      id: string
      name: string
      sharedDriveId: string
      shareLink: string
      path: string
    }
  }
}

@Injectable()
export class FilesystemApiService {
  private baseUrl = `${process.env.FILE_API_URL}/filesystem`

  async requestToCreateGoogleSharedDrive(name: string) {
    const url = `${this.baseUrl}/${encodeURIComponent(name)}`
    const response: CreateGoogleSharedDriveResponse = await got.post(url).json()
    return response.data
  }
}
