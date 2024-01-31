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
    console.log(`[sendRFI] gmail.users.messages : ${JSON.stringify(gmail.users.messages)}`)

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

    const res = await gmail.users.messages
      .send({
        userId: 'me',
        requestBody: {
          raw: base64EncodedEmail,
          // threadId,
        },
      })
      .catch((error) => {
        if (error.status === 404) {
          console.log(`[sendRFI] error : ${error}`)
        }
      })

    console.log('🚀 ~ file: send.mjs:49 ~ sendEmail ~ res:', res)

    // return res.data;
  }

  async getGmailClient(sender: string) {
    console.log(`[getGmailClient] sender: ${sender}`)
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://mail.google.com'],
      keyFile: './baruncorp-file-service-1b5ac540d6f3.json',
      clientOptions: {
        subject: sender, //"automation@baruncorp.com",
      },
    })

    const authClient: OAuth2Client = (await auth.getClient()) as OAuth2Client
    // const tokenInfo = await authClient.getAccessToken()
    // console.log(`[getGmailClient] tokenInfo : ${tokenInfo}`);
    return google.gmail({ version: 'v1', auth: authClient })
  }
}
