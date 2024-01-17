import { HttpException } from '@nestjs/common'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function CustomMax(maxValue: number, exception: HttpException, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'customMax',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [max] = args.constraints

          if (value > max) {
            throw exception
          }

          return true
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not exceed a maximum value of ${args.constraints[0]}}`
        },
      },
    })
  }
}
