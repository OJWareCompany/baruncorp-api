import { JobNoteUser } from './value-object/job-note.user.vo'
import { OAuth2Client } from 'google-auth-library'
import Imap from 'imap'

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

export interface IImapConnection {
  auth2Client: OAuth2Client
  imap: Imap
}

export enum JobNoteTypeEnum {
  JobNote = 'JobNote',
  RFI = 'RFI',
}
