import { HttpException } from '@nestjs/common'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function CustomMin(minValue: number, exception: HttpException, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'customMin',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min] = args.constraints

          if (value < min) {
            throw exception
          }

          return true
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be less than a minimum value of ${args.constraints[0]}`
        },
      },
    })
  }
}
