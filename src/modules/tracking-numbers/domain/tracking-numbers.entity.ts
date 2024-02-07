import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateTrackingNumbersProps, TrackingNumbersProps } from './tracking-numbers.type'
import { TooLongTrackingNumberException } from '@modules/tracking-numbers/domain/tracking-numbers.error'

export class TrackingNumbersEntity extends AggregateRoot<TrackingNumbersProps> {
  protected _id: string

  static create(create: CreateTrackingNumbersProps) {
    const id: string = v4()
    const props: TrackingNumbersProps = {
      ...create,
    }

    return new TrackingNumbersEntity({ id, props })
  }

  get jobId(): string {
    return this.props.jobId
  }

  set jobId(jobId: string) {
    this.props.jobId = jobId
  }

  get courierId(): string {
    return this.props.courierId
  }

  set courierId(courierId: string) {
    this.props.courierId = courierId
  }

  get createdBy(): string {
    return this.props.createdBy
  }

  set createdBy(createdBy: string) {
    this.props.createdBy = createdBy
  }

  get trackingNumber(): string {
    return this.props.trackingNumber
  }

  set trackingNumber(trackingNumber: string) {
    this.props.trackingNumber = trackingNumber
  }

  public checkValidation() {
    if (this.trackingNumber.length > 50) {
      throw new TooLongTrackingNumberException()
    }
  }
  public validate(): void {
    return
  }
}
