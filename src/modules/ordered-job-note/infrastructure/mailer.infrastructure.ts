import { Injectable } from '@nestjs/common'
import { compute_v1, gmail_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface IRFIMail {
  subject: string
  text: string
  from: string
  to: string[]
  threadId: string | null
  files: Express.Multer.File[] | null
}

@Injectable()
export class RFIMailer {
  async sendRFI(input: IRFIMail) {
    const oAuth2Client: OAuth2Client = await this.getGoogleAuthClient(input.from)
    const gmail: gmail_v1.Gmail = await this.getGmailClient(oAuth2Client)

    const email: string = this.getEmailLine(input).join('\n').trim()
    console.log(`input.text : ${input.text}`)

    let base64EncodedEmail: string = Buffer.from(email).toString('base64')
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    console.log(`[RFIMailer] input.threadId ${input.threadId}`)
    const requestBody = { raw: base64EncodedEmail, ...(input.threadId && { threadId: input.threadId }) }
    const res = await gmail.users.messages
      .send({
        userId: 'me',
        requestBody: requestBody,
      })
      .catch((error) => {
        if (error.status === 404) {
          // Todo. 메일 전송 내역에서 해당 threadID를 가진 메일들을 모두 Delete Forever했을 시 해당 ThreadId로 메일 전송 에러 발생
          // Todo. threadId없이 메일을 보내고, 보낸 메일의 threadId를 job의 threadIds에서 보낸 이메일 주소에 대한 threadIds를 교체
          console.log(`[sendRFI] error : ${error}`)
        }
      })

    console.log(`[sendRFI] threadId : ${res?.data.threadId}`)
    return res?.data
  }

  async getGmailClient(oAuth2Client: OAuth2Client) {
    return google.gmail({ version: 'v1', auth: oAuth2Client })
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

  getEmailLine(input: IRFIMail) {
    const boundary = 'boundary123456'
    const emailLines = []
    emailLines.push(`To: ${input.to}`)
    emailLines.push(`From: ${input.from}`)
    emailLines.push('Content-type: multipart/mixed; boundary=' + boundary)
    emailLines.push('MIME-Version: 1.0')
    emailLines.push(`Subject: ${input.subject}`)
    emailLines.push('')
    emailLines.push('--' + boundary)
    emailLines.push('Content-Type: text/plain; charset="UTF-8"')
    emailLines.push('MIME-Version: 1.0')
    emailLines.push('')
    emailLines.push(input.text)
    emailLines.push('')
    emailLines.push('--' + boundary)

    if (input.files) {
      // 첨부 파일 처리
      for (const file of input.files) {
        const attachmentBase64 = file.buffer.toString('base64')
        emailLines.push(`Content-Type: ${file.mimetype}; name="${file.originalname}"`)
        emailLines.push(`Content-Disposition: attachment; filename="${file.originalname}"`)
        emailLines.push('Content-Transfer-Encoding: base64')
        emailLines.push('')
        emailLines.push(attachmentBase64)
        emailLines.push('--' + boundary)
      }
    }

    emailLines.push('')
    emailLines.push('--') // 메시지 종료

    return emailLines
  }
}
