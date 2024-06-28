import { ConfigModule } from '@nestjs/config'
import { IRFIMail } from '../../../ordered-job-note/infrastructure/mailer.infrastructure'
import { JobEntity } from '../job.entity'
import { ProjectEntity } from '../../../project/domain/project.entity'
import { TrackingNumbersResponseDto } from '../../../tracking-numbers/dtos/tracking-numbers.response.dto'

ConfigModule.forRoot()
const { APP_MODE, WEB_URL } = process.env

export class MakeDeliverablesEmailContents {
  format(
    project: ProjectEntity,
    job: JobEntity,
    deliverablesFolderShareLink: string,
    trackings: TrackingNumbersResponseDto[],
  ): IRFIMail {
    const devEmails = job.deliverablesEmails.filter((email) => email.endsWith('oj.vision'))
    const devEmail = devEmails.length ? devEmails : ['hyomin@oj.vision']
    const to: string[] = APP_MODE === 'production' ? job.deliverablesEmails : devEmail
    const textForDev = APP_MODE === 'production' ? '' : 'THIS IS FROM DEVELOPMENT SERVER'

    const subject = `NoReply Completed ${job.jobName}`
    const contents =
      textForDev +
      `
    <p><strong>DO NOT REPLY, THIS IS AN AUTOMATED MESSAGE. Please send any messages to <a href="mailto:newjobs@baruncorp.com">newjobs@baruncorp.com</a>.</strong></p>
    <p>${job.jobName} has been completed.</p>
    <p><strong>Project Management:</strong> Jobs (${job.jobName})</p>
    <p><strong>Client</strong><br>
    ${job.organizationName}</p>
    <p><strong>Client Contact</strong><br>
    ${job.getProps().clientInfo.clientUserName}</p>
    <p><strong>Client Contact Email</strong><br>
    <a href="mailto:${job.getProps().clientInfo.clientContactEmail}">${
        job.getProps().clientInfo.clientContactEmail
      }</a></p>
    <p><strong>Project Number</strong><br>
    ${job.getProps().projectNumber || ''}</p>
    <p><strong>Property Address</strong><br>
    <a href="https://www.google.com/maps/search/428+South+Spencer,+Mesa,+Arizona+85204?entry=gmail&amp;source=g">${
      project.projectPropertyAddress.fullAddress
    }</a></p>
    <p><strong>Property Owner Name</strong><br>
    ${project.projectPropertyOwnerName || ''}</p>
    <p><strong>Property Type</strong><br>
    ${project.projectPropertyType}</p>
    ${trackings.map(this.formatTracking)}
    <p><strong>Deliverables</strong><br>
    <a href="${deliverablesFolderShareLink}">Click to View Deliverables</a></p>
    <p><strong>Are Structural Upgrades Required?</strong><br>
    ${job.getProps().structuralUpgradeNote ? job.getProps().structuralUpgradeNote : ''}</br>
    <p><strong>Service Order</strong></p>
    <a href="${WEB_URL}/jobs/${job.id}">Click To Service Order</a></p>

    <br><br>
    <br>Barun Corp
    <br>Phone: (610) 202-4506
    <br>Website: <a href="www.baruncorp.com" target="_blank">baruncorp.com</a>
    `

    const input: IRFIMail = {
      subject: subject,
      text: contents,
      from: 'automation@baruncorp.com',
      to: to,
      threadId: null,
      files: null,
    }

    return input
  }

  formatTracking(tracking: TrackingNumbersResponseDto) {
    return `
    <p><strong>${tracking.courierName} Tracking Numbers</strong><br>
    ${tracking.trackingNumber}
    <p><strong>${tracking.courierName} Tracking Link</strong><br>
    <a href="${tracking.trackingNumberUri}">Click to Track Packages</a></p>
    `
  }
}
