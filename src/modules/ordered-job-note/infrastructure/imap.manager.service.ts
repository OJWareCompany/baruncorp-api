import { Injectable } from '@nestjs/common'
import Imap from 'imap'
import { RFIMailer } from '@modules/ordered-job-note/infrastructure/mailer.infrastructure'
import * as xoauth2 from 'xoauth2'
import { Credentials, OAuth2Client } from 'google-auth-library'
import { gmail_v1 } from 'googleapis'
import { inspect } from 'util'
import { AddressObject, ParsedMail, simpleParser } from 'mailparser'
import { JobNoteRepository } from '@modules/ordered-job-note/database/job-note.repository'
import { JobNoteEntity } from '@modules/ordered-job-note/domain/job-note.entity'
import { IImapConnection, JobNoteTypeEnum } from '@modules/ordered-job-note/domain/job-note.type'
import { GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'
import { PrismaService } from '@modules/database/prisma.service'
import { UserStatusEnum } from '@modules/users/domain/user.types'

@Injectable()
export class ImapManagerService {
  // private imapConnections: Map<string, Imap> = new Map<string, Imap>()
  private imapConnections: Map<string, IImapConnection> = new Map()
  constructor(
    private readonly jobNoteRepository: JobNoteRepository,
    private readonly prismaService: PrismaService,
    private readonly mailer: RFIMailer,
  ) {}

  async initImapConnection() {
    try {
      // 활성화된 Baruncorp 유저 리스트 받아온다.
      const users = await this.prismaService.users.findMany({
        where: {
          email: { contains: 'baruncorp.com' },
          status: UserStatusEnum.ACTIVE,
        },
        select: {
          id: true,
          email: true,
        },
      })

      for (const user of users) {
        await this.connect(user.email)
      }

      // 각 클라이언트 들에 대해 Imap Connect
    } catch (error) {
      console.log(`[initImapConnection] error : ${error}`)
    }
  }

  async connect(targetEmail: string) {
    try {
      // console.log(`[connectToMailbox] targetEmail : ${targetEmail}`)
      const auth2Client: OAuth2Client = await this.mailer.getGoogleAuthClient(targetEmail)
      auth2Client.on('tokens', (tokens: Credentials) => {
        // 자동으로 토큰 만료 직전에 tokens 이벤트 발생
        if (tokens.access_token) {
          // console.log(`New access_token received: ${tokens.access_token}`)
          this.resetImapConnection(targetEmail, tokens.access_token, auth2Client)
        }
      })
      await auth2Client.getAccessToken()
    } catch (error) {
      console.log(`[ImapManagerService][connectToMailbox] ${error} / targetEmail : ${targetEmail}`)
    }
  }

  async disconnect(targetEmail: string) {
    const connection: IImapConnection | undefined = this.imapConnections.get(targetEmail)
    if (connection) {
      connection.auth2Client.removeAllListeners() // auth2Client의 'tokens'이벤트 제거
      connection.imap.end() // IMAP 연결 제거
      this.imapConnections.delete(targetEmail)
    }
    // console.log(`[ImapManagerService][disconnect] imapConnectionsSize : ${JSON.stringify(this.imapConnections.size)}`)
  }

  private resetImapConnection(targetEmail: string, newToken: string, auth2Client: OAuth2Client) {
    // console.log(`[ImapManagerService][resetImapConnection]`)
    const connection: IImapConnection | undefined = this.imapConnections.get(targetEmail)
    if (connection) {
      connection.imap.end() // 기존 연결 종료
      this.imapConnections.delete(targetEmail) // 맵에서 제거
    }

    const xoauth2gen = xoauth2.createXOAuth2Generator({
      user: targetEmail,
      accessToken: newToken,
    })

    xoauth2gen.getToken((err: string, token: string) => {
      if (err) {
        return console.log(err)
      }

      const imapConfig: Imap.Config = {
        user: targetEmail,
        xoauth2: token,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false,
        },
      } as Imap.Config

      const imap: Imap = new Imap(imapConfig)
      this.setupImapListeners(auth2Client, imap)
      imap.connect()

      const connection: IImapConnection = {
        auth2Client: auth2Client,
        imap: imap,
      }
      this.imapConnections.set(targetEmail, connection)

      // console.log(`[ImapManagerService][connectToMailbox] imapConnectionsSize : ${this.imapConnections.size}`)
    })
  }

  private setupImapListeners(auth2Client: OAuth2Client, imap: Imap) {
    imap.once('ready', () => this.onImapReady(auth2Client, imap))
    imap.once('error', (err: any) => this.onImapError(err))
    imap.once('end', () => this.onImapEnd())
  }

  private onImapError(err: any) {
    console.error(`[ImapManagerService] ${JSON.stringify(err)}`)
  }

  private onImapEnd() {
    console.log('[ImapManagerService] Connection ended')
  }

  private onImapReady(auth2Client: OAuth2Client, imap: Imap) {
    // console.log(`[ImapManagerService][connectToMailbox][openInbox] ready`)
    imap.openBox('INBOX', false, (err: Error, box: Imap.Box) => {
      if (err) {
        console.log(`🚀 ~ file: index.js:132 ~ err: ${err}`)
        return
      }
      // console.log(`[openInbox] box : ${JSON.stringify(box)}`);
      imap.on('mail', (numNewMsgs: string) => this.onNewMail(auth2Client, imap, numNewMsgs))
    })
  }

  private onNewMail(auth2Client: OAuth2Client, imap: Imap, numNewMsgs: string) {
    const fetch: Imap.ImapFetch = imap.seq.fetch('*', {
      bodies: '',
      struct: true,
    })

    fetch.on('message', (msg: Imap.ImapMessage, seqno: number) => this.processMessage(msg, seqno, auth2Client))
    fetch.once('error', (err: Error) => console.log('Fetch error: ' + err))
    fetch.once('end', () => {
      // console.log('Done fetching all messages!')
    })
  }

  private async processMessage(msg: Imap.ImapMessage, seqno: number, auth2Client: OAuth2Client) {
    const prefix: string = '(#' + seqno + ') '
    // console.log("Message #%d", seqno);
    msg.on('body', (stream, info) => this.processMessageBody(stream, auth2Client))
    msg.once('attributes', (attrs) => {
      // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8))
    })
    msg.once('end', () => {
      // console.log(prefix + 'Finished')
    })
  }

  private async processMessageBody(stream: NodeJS.ReadableStream, auth2Client: OAuth2Client) {
    let buffer = ''
    for await (const chunk of stream) {
      buffer += chunk.toString('utf8')
    }
    // console.log("🚀 ~ file: index.js:34 ~ buffer:", buffer);
    try {
      const parsed: ParsedMail = await simpleParser(buffer)
      await this.fetchAndProcessEmails(parsed, auth2Client)
    } catch (e) {}
  }

  private async fetchAndProcessEmails(parsed: ParsedMail, auth2Client: OAuth2Client) {
    try {
      const gmail: gmail_v1.Gmail = await this.mailer.getGmailClient(auth2Client)
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: `rfc822msgid:${parsed.messageId}`,
      })

      const messages = res.data.messages
      if (messages && messages.length > 0) {
        const threadId: string | null | undefined = messages[0].threadId
        const senderEmail: string | undefined = parsed.from?.value[0]?.address
        const receiverEmails: string[] = Array.isArray(parsed.to)
          ? parsed.to.map((address: AddressObject) => address.value[0].address ?? '')
          : parsed.to
          ? [parsed.to.value[0].address ?? '']
          : []
        // console.log(`from : ${senderEmail}`)
        // console.log(`to : ${receiverEmails.toString()}`)
        // console.log(`MessageId : ${parsed.messageId}`)
        // console.log(`Found thread ID: ${threadId}`)
        // console.log(`subject : ${parsed.subject!}`)
        // 바른코프 직원이 보낸 메일은 버린다(createJobNote에서 이미 RFI 생성)
        if (!threadId || !senderEmail || senderEmail.toLowerCase().includes('baruncorp.com')) {
          return
        }

        const equalThreadIdEntity: JobNoteEntity | null = await this.jobNoteRepository.findOneFromMailThreadId(threadId)
        // console.log(`equalThreadEntity : ${JSON.stringify(equalThreadIdEntity)}`)

        // 같은 ThreadId를 가진 메시지가 없다는 것은 바른코프 직원으로부터 받은 RFI 메일의 답장이 아니기에 버린다.
        if (!equalThreadIdEntity) return

        const maxJobNoteNumber: number | null = await this.jobNoteRepository.getMaxJobNoteNumber(
          equalThreadIdEntity.jobId,
        )

        const filteredContent: string = parsed.text ? this.removeOriginalMessage(parsed.text) : ''
        // console.log(`maxJobNoteNumber : ${maxJobNoteNumber}`)
        // console.log(`Add RFI`)
        await this.jobNoteRepository.insert(
          JobNoteEntity.create({
            jobId: equalThreadIdEntity.jobId,
            creatorUserId: null,
            type: JobNoteTypeEnum.RFI,
            content: filteredContent,
            jobNoteNumber: maxJobNoteNumber ? maxJobNoteNumber + 1 : 1,
            senderEmail: senderEmail ?? '',
            receiverEmails: receiverEmails,
            emailThreadId: threadId,
          }),
        )
      } else {
        console.log('No message found with the specified Message-ID')
      }
    } catch (err) {
      console.error('The API returned an error: ', err)
    }
  }

  private removeOriginalMessage(input: string): string {
    const lines = input.split('\n')
    let result = ''
    let skipLines = false

    for (const line of lines) {
      if (line.includes('Original Message')) {
        skipLines = true
      }

      if (!skipLines) {
        result += line + '\n'
      }
    }

    return result.trim() // 마지막에 추가된 개행 문자 제거
  }
}
