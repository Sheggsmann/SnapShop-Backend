/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectSchema } from 'joi';
import { JoiValidationError } from './error-handler';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function validator(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new JoiValidationError(error.details[0].message);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
