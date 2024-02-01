import { JobNoteUser } from './value-object/job-note.user.vo'

export interface CreateJobNoteProps {
  jobId: string
  creatorUserId: string | null
  type: JobNoteTypeEnum
  content: string
  jobNoteNumber: number
  senderEmail: string | null
  receiverEmails: string[] | null
  emailThreadId: string | null
}

export interface JobNoteProps extends CreateJobNoteProps {
  creatorUser: JobNoteUser | null
}

export enum JobNoteTypeEnum {
  JobNote = 'JobNote',
  RFI = 'RFI',
}

// Todo. 하드코딩 추후 제거한다
export const RFISignature = `
Barun Corp
Phone: (610) 202-4506
Website: baruncorp.com
`
