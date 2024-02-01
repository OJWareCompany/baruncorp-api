import { Injectable } from '@nestjs/common'
import { compute_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface IRFIMail {
  subject: string
  text: string
  from: string
  to: string[]
  threadId: string | null
}

@Injectable()
export class RFIMailer {
  async sendRFI(input: IRFIMail) {
    const gmail = await this.getGmailClient(input.from)

    const emailLines = []
    emailLines.push(`To: ${input.to}`)
    emailLines.push('Content-type: text/plain;charset=utf-8')
    emailLines.push('MIME-Version: 1.0')
    emailLines.push(`Subject: ${input.subject}`)
    emailLines.push('')
    emailLines.push(input.text)

    const email: string = emailLines.join('\n').trim()
    // console.log(`[sendRFI] email : ${JSON.stringify(email)}`)

    let base64EncodedEmail = Buffer.from(email).toString('base64')
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    const requestBody = input.threadId
      ? {
          raw: base64EncodedEmail,
          threadId: input.threadId,
        }
      : {
          raw: base64EncodedEmail,
        }
    console.log(`[sendRFI] requestBody : ${JSON.stringify(requestBody)}`)
    const res = await gmail.users.messages
      .send({
        userId: 'me',
        requestBody: requestBody,
      })
      .catch((error) => {
        if (error.status === 404) {
          console.log(`[sendRFI] error : ${error}`)
        }
      })

    console.log(`[sendRFI] threadId : ${res?.data.threadId}`)
    return res?.data.threadId ?? null
  }

  async getGmailClient(sender: string) {
    const authClient: OAuth2Client = await this.getGoogleAuthClient(sender)
    return google.gmail({ version: 'v1', auth: authClient })
  }

  async getGoogleAuthClient(sender: string): Promise<OAuth2Client> {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://mail.google.com'],
      keyFile: './baruncorp-file-service-1b5ac540d6f3.json',
      clientOptions: {
        subject: sender,
      },
    })

    return (await auth.getClient()) as OAuth2Client
  }
}
