import { ValueObject } from '../../../../libs/ddd/value-object.base'

export enum OrderedJobsPriorityEnum {
  Immediate = 'Immediate',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum OrderedJobsPriorityLevelEnum {
  Immediate = 1,
  High = 2,
  Medium = 3,
  Low = 4,
}

interface PriorityProps {
  name: OrderedJobsPriorityEnum
  level: OrderedJobsPriorityLevelEnum
}

export class Priority extends ValueObject<PriorityProps> {
  constructor(props: { priority: OrderedJobsPriorityEnum }) {
    const priorityLevel =
      props.priority === OrderedJobsPriorityEnum.Immediate
        ? OrderedJobsPriorityLevelEnum.Immediate
        : OrderedJobsPriorityEnum.High
        ? OrderedJobsPriorityLevelEnum.High
        : OrderedJobsPriorityEnum.Medium
        ? OrderedJobsPriorityLevelEnum.Medium
        : OrderedJobsPriorityLevelEnum.Low

    super({
      name: props.priority,
      level: priorityLevel,
    })
  }

  get name(): OrderedJobsPriorityEnum {
    return this.props.name
  }

  get level(): OrderedJobsPriorityLevelEnum {
    return this.props.level
  }

  protected validate(props: PriorityProps): void {
    const priorityValues = [...Object.values(OrderedJobsPriorityEnum)]
    const priorityLevelValues = [...Object.values(OrderedJobsPriorityLevelEnum)]

    if (!priorityValues.includes(props.name)) {
      throw new Error('Invalid Priority Value.')
    }

    if (!priorityLevelValues.includes(props.level)) {
      throw new Error('Invalid Priority Level Value.')
    }
  }
}
