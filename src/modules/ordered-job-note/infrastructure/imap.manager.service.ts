import { Injectable } from '@nestjs/common'
import Imap from 'imap'
import { RFIMailer } from '@modules/ordered-job-note/infrastructure/mailer.infrastructure'
import keys from '../../../../baruncorp-file-service-1b5ac540d6f3.json' //assert { type: "json" };
import * as xoauth2 from 'xoauth2'
import { Credentials, JWT, OAuth2Client } from 'google-auth-library'
import { gmail_v1 } from 'googleapis'
import { inspect } from 'util'
import { AddressObject, ParsedMail, simpleParser } from 'mailparser'

@Injectable()
export class ImapManagerService {
  private imapConnections: Map<string, Imap> = new Map<string, Imap>()
  constructor(private readonly mailer: RFIMailer) {}

  async connectToMailbox(targetEmail: string) {
    const auth2Client: OAuth2Client = await this.mailer.getGoogleAuthClient(targetEmail)
    const accessToken = await auth2Client.getAccessToken()

    const xoauth2gen = xoauth2.createXOAuth2Generator({
      user: targetEmail,
      accessToken: accessToken.token,
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

      this.setupImapListeners(targetEmail, imap)
      imap.connect()

      this.imapConnections.set(targetEmail, imap)
      console.log(`[ImapManagerService][connectToMailbox] imapConnections : ${JSON.stringify(this.imapConnections)}`)
    })
  }

  private setupImapListeners(targetEmail: string, imap: Imap) {
    imap.once('ready', () => this.onImapReady(targetEmail, imap))
    imap.once('error', (err: any) => this.onImapError(err))
    imap.once('end', () => this.onImapEnd())
  }

  private onImapError(err: any) {
    console.error(`[ImapManagerService] err: ${JSON.stringify(err)}`)
  }

  private onImapEnd() {
    console.log('[ImapManagerService] Connection ended')
  }

  private onImapReady(targetEmail: string, imap: Imap) {
    console.log(`[ImapManagerService][connectToMailbox][openInbox] ready`)
    imap.openBox('INBOX', false, (err: Error, box: Imap.Box) => {
      if (err) {
        console.log(`🚀 ~ file: index.js:132 ~ err: ${err}`)
        return
      }
      // console.log(`[openInbox] box : ${JSON.stringify(box)}`);
      imap.on('mail', (numNewMsgs: string) => this.onNewMail(targetEmail, imap, numNewMsgs))
    })
  }

  private onNewMail(targetEmail: string, imap: Imap, numNewMsgs: string) {
    const fetch: Imap.ImapFetch = imap.seq.fetch('*', {
      bodies: '',
      struct: true,
    })

    fetch.on('message', (msg: Imap.ImapMessage, seqno: number) => this.processMessage(msg, seqno, targetEmail))
    fetch.once('error', (err: Error) => console.log('Fetch error: ' + err))
    fetch.once('end', () => console.log('Done fetching all messages!'))
  }

  private async processMessage(msg: Imap.ImapMessage, seqno: number, targetEmail: string) {
    const prefix: string = '(#' + seqno + ') '
    // console.log("Message #%d", seqno);
    msg.on('body', (stream, info) => this.processMessageBody(stream, targetEmail))
    msg.once('attributes', (attrs) => console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8)))
    msg.once('end', () => console.log(prefix + 'Finished'))
  }

  private async processMessageBody(stream: NodeJS.ReadableStream, targetEmail: string) {
    let buffer = ''
    for await (const chunk of stream) {
      buffer += chunk.toString('utf8')
    }
    // console.log("🚀 ~ file: index.js:34 ~ buffer:", buffer);
    try {
      const parsed: ParsedMail = await simpleParser(buffer)
      await this.fetchAndProcessEmails(parsed, targetEmail)
    } catch (e) {}
  }

  private async fetchAndProcessEmails(parsed: ParsedMail, targetEmail: string) {
    try {
      const gmail: gmail_v1.Gmail = await this.mailer.getGmailClient(targetEmail)
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: `rfc822msgid:${parsed.messageId}`,
      })

      const messages = res.data.messages
      if (messages && messages.length > 0) {
        const threadId = messages[0].threadId
        // console.log(`messages: ${JSON.stringify(messages)}`);
        console.log('Found thread ID:', threadId)

        const to: string[] = Array.isArray(parsed.to)
          ? parsed.to.map((address) => address.text)
          : parsed.to
          ? [parsed.to.text]
          : []

        const from: string | undefined = parsed.from?.value[0]?.address
        // const to:  string[] =
        const subject: string = parsed.subject ?? ''
        const text: string = parsed.text ?? ''

        console.log(`from : ${from}`)
        console.log(`to : ${to.toString()}`)

        // 들어온 이메일의 subject가 `Re: [BARUN CORP]`로 시작하는지 확인합니다. 맞다면 진행합니다.
        if (subject.includes('Re: [BARUN CORP]')) {
          // 이 threadId를 가지고 있는 job이 있는지 확인을 하고, 있다면 그 job의 job note에 데이터를 쌓습니다.
        }
      } else {
        console.log('No message found with the specified Message-ID')
      }
    } catch (err) {
      console.error('The API returned an error: ', err)
    }
  }

  async disconnect(targetEmail: string) {
    const imap: Imap | undefined = this.imapConnections.get(targetEmail)
    if (imap) {
      console.log(`[ImapManagerService] imap end`)
      imap.end()
      this.imapConnections.delete(targetEmail)
    }
    console.log(`[ImapManagerService][disconnect] imapConnections : ${JSON.stringify(this.imapConnections)}`)
  }
}
