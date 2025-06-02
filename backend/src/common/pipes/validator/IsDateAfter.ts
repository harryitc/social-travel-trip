import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import moment from 'moment';

export function IsDateAfter(property: string, format, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsDateAfter',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property, format],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = args.object[relatedPropertyName]
                    return moment(value, format).isAfter(moment(relatedValue, format))
                },
                defaultMessage(args: ValidationArguments) {
                    const format = args.constraints[0];
                    return `$property must be after $constraint1`;
                }
            },
        });
    };
}