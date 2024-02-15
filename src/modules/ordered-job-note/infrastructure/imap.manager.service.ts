import { Injectable } from '@nestjs/common'
import Imap from 'imap'
import { RFIMailer } from '@modules/ordered-job-note/infrastructure/mailer.infrastructure'
import * as xoauth2 from 'xoauth2'
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1 } from 'googleapis'
import { AddressObject, ParsedMail, simpleParser } from 'mailparser'
import { JobNoteRepository } from '@modules/ordered-job-note/database/job-note.repository'
import { JobNoteEntity } from '@modules/ordered-job-note/domain/job-note.entity'
import { JobNoteTypeEnum } from '@modules/ordered-job-note/domain/job-note.type'
import { PrismaService } from '@modules/database/prisma.service'
import { UserStatusEnum } from '@modules/users/domain/user.types'
import { GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'

@Injectable()
export class ImapManagerService {
  private imapSessions: Map<string, Imap> = new Map()
  constructor(
    private readonly jobNoteRepository: JobNoteRepository,
    private readonly prismaService: PrismaService,
    private readonly mailer: RFIMailer,
  ) {}

  // 앱 실행 시 Imap Server에 Connection 요청
  async initImapConnection() {
    try {
      // 활성화된 Baruncorp 유저 리스트 받아온다.
      const users: { id: string; email: string }[] = await this.prismaService.users.findMany({
        where: {
          email: { contains: 'baruncorp.com' },
          status: UserStatusEnum.ACTIVE,
        },
        select: {
          id: true,
          email: true,
        },
      })

      Promise.all(
        users.map((user) =>
          this.connect(user.email).catch((error) => {
            // console.log(`Failed to connect to ${user.email}: ${error}`);
          }),
        ),
      )
        .then((results) => {
          // console.log(`[initImapConnection] complete`);
        })
        .catch((error) => {
          // console.error(`[initImapConnection] err: ${error}`);
        })
    } catch (error) {
      // console.log(`[initImapConnection] error : ${error}`)
    }
  }

  async connect(targetEmail: string) {
    try {
      // 무조건 targetEmail에 대한 세션을 검사 한 후 connection 진행한다.
      this.disconnect(targetEmail)
      // 인증 진행
      const auth2Client: OAuth2Client = await this.mailer.getGoogleAuthClient(targetEmail)

      const response: GetAccessTokenResponse = await auth2Client.getAccessToken()
      if (!response.token) return

      const xoauth2gen = xoauth2.createXOAuth2Generator({
        user: targetEmail,
        accessToken: response.token,
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

        const imapSession: Imap = new Imap(imapConfig)

        this.initImapListeners(auth2Client, imapSession)
        imapSession.connect()

        this.imapSessions.set(targetEmail, imapSession)

        // console.log(`[ImapManagerService][connect] targetEmail : ${targetEmail} / imapSessionsSize : ${this.imapSessions.size}`)
      })
    } catch (error) {
      // console.log(`[ImapManagerService][connect] ${error} / targetEmail : ${targetEmail}`)
    }
  }

  async disconnect(targetEmail: string) {
    const imapSession: Imap | undefined = this.imapSessions.get(targetEmail)
    if (imapSession) {
      this.imapSessions.delete(targetEmail)
      imapSession.removeAllListeners()
      imapSession.end()

      // console.log(`[ImapManagerService][disconnect] imapConnectionsSize : ${JSON.stringify(this.imapSessions.size)}`)
    }
  }

  private initImapListeners(auth2Client: OAuth2Client, imap: Imap) {
    imap.once('ready', () => this.onImapReady(auth2Client, imap))
    imap.once('error', (err: any) => this.onImapError(err))
    imap.once('end', () => this.onImapEnd())
  }

  private onImapError(err: any) {
    // console.error(`[ImapManagerService][onImapError] ${JSON.stringify(err)}`)
  }

  private onImapEnd() {
    // console.log('[ImapManagerService] Connection ended')
    // 어떤 소켓이 끊겼는지 정보를 해당 콜백에서 제공 하지 않음. => 전체 세션에서 상태 검사
    const disconnectedConnections: [string, Imap][] = [...this.imapSessions].filter(
      ([targetMail, imapClient]) => imapClient.state === 'disconnected',
    )

    disconnectedConnections.forEach(([targetEmail, connection]) => {
      // console.log(`[ImapManagerService][onImapEnd] retry : ${targetEmail}`)
      this.connect(targetEmail)
    })
  }

  private onImapReady(auth2Client: OAuth2Client, imap: Imap) {
    // console.log(`[ImapManagerService][connectToMailbox][openInbox] ready`)
    imap.openBox('INBOX', false, (err: Error, box: Imap.Box) => {
      if (err) {
        // console.log(`🚀 ~ file: index.js:132 ~ err: ${err}`)
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
    fetch.on('message', (msg: Imap.ImapMessage, seqno: number) => {
      this.processMessage(msg, seqno, auth2Client)
    })
    fetch.once('error', (err: Error) => {
      // console.log('[ImapManagerService][onNewMail][error]')
      // console.log('Fetch error: ' + err)
    })
    fetch.once('end', () => {
      // console.log('[ImapManagerService][onNewMail][end]')
    })
  }

  private async processMessage(msg: Imap.ImapMessage, seqno: number, auth2Client: OAuth2Client) {
    const prefix: string = '(#' + seqno + ') '
    // console.log("Message #%d", seqno);
    msg.on('body', (stream, info) => {
      this.processMessageBody(stream, auth2Client)
    })
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
        // console.log(`[fetchAndProcessEmails] from : ${senderEmail}`)
        // console.log(`[fetchAndProcessEmails] to : ${receiverEmails.toString()}`)
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
        const filteredContent: string = parsed.text ? this.parseEmailMainContent(parsed.text) : ''
        // const filteredContent: string = parsed.text ?? ''
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
        // console.log('No message found with the specified Message-ID')
      }
    } catch (err) {
      // console.error('The API returned an error: ', err)
    }
  }

  private parseEmailMainContent(input: string): string {
    // Gmail Case
    // 콜론(:)이 이메일 주소와 같은 라인에 바로 이어지는 경우, 이메일 주소 다음 라인에 있을 경우,
    // 그리고 이메일 주소와 같은 라인에 있지만 그 앞에 다른 문자열(예: "wrote")이 있는 경우를 모두 포함.
    // const gmailReplyHeaderPattern: RegExp = /<[^>]+@[^>]+>(?:.*\n)?\s*.*:/g
    const gmailReplyHeaderPattern = /[^@\s]+@[^@\s]+\.[^@\s]+(?:.*\n)?\s*.*:/g
    // 기타 이메일(Ecount, Namer)
    const replyHeaderPattern = /.*(-{4,}\s*[^-\s].*?\s*-{4,}).*/
    // 답장 헤더의 위치를 찾습니다.
    const replyHeaderMatches: RegExpMatchArray[] = Array.from(input.matchAll(gmailReplyHeaderPattern))
    // 초기 cutOffIndex 설정
    let cutOffIndex: number = input.length
    if (replyHeaderMatches.length > 0) {
      // 가장 첫 번째 매치의 시작 인덱스를 사용.
      const firstMatchIndex: number | undefined = replyHeaderMatches[0].index
      // 해당 매치의 첫 번째 줄바꿈 문자 이전까지를 기준으로 본문을 추출.
      const prevNewLineIndex: number = input.lastIndexOf('\n', firstMatchIndex)
      cutOffIndex = prevNewLineIndex > -1 ? prevNewLineIndex : 0
    }
    // 서명 구분자의 위치
    const signatureMatch: RegExpExecArray | null = replyHeaderPattern.exec(input)
    if (signatureMatch) {
      const signatureIndex: number = signatureMatch.index
      const prevNewLineIndex: number = input.lastIndexOf('\n', signatureIndex)
      cutOffIndex = Math.min(cutOffIndex, prevNewLineIndex > -1 ? prevNewLineIndex : 0)
    }
    // 결정된 위치 이전의 텍스트를 본문으로 간주
    const replyContent: string = input.substring(0, cutOffIndex).trim()

    return replyContent
  }
}
