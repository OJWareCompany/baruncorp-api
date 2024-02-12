import { HttpException } from '@nestjs/common'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsTime(exception: HttpException, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$|^24:00:00$/
          console.log(`value : ${JSON.stringify(value)}`)
          if (typeof value === 'string' && timeRegex.test(value)) {
            return true
          }

          throw exception
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time format (HH:mm:ss)`
        },
      },
    })
  }
}
