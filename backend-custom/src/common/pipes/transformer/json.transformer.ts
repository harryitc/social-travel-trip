import { BadRequestException } from '@common/exceptions';

export function jsonParseTransformer({ key, value }) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new BadRequestException(`${key} must be a JSON`);
  }
}
