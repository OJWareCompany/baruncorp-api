import { Injectable } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import nodemailer from 'nodemailer'

ConfigModule.forRoot()
const { EMAIL_USER, EMAIL_PASS } = process.env

export type DeliverablesMailOption = { to: string[]; deliverablesLink: string }

@Injectable()
export class Mailer {
  async sendDeliverablesEmail(option: DeliverablesMailOption) {
    const transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.com',
      host: 'wsmtp.ecounterp.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_USER,
      to: [...option.to, 'bs_khm@naver.com'],
      subject: `BarunCorp Deliverables`,
      text: `deliverables link: ${option.deliverablesLink}`,
    }

    try {
      const sent = await transporter.sendMail(mailOptions)
      // console.log('Email sent!: ' + sent.response)
    } catch (error) {
      console.log(error)
    }
  }
}
