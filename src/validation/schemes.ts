import Joi from 'joi';
import { newRule } from '../types/types';

export const validObject = (data: {
  [key: string]: string;
}): string | undefined => {
  const objForSchema = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      return key === 'id'
        ? [key, Joi.number().required()]
        : [key, Joi.string().required()];
    })
  );

  const schema = Joi.object(objForSchema);

  const validation = schema.validate(data);
  const { error } = validation;

  if (error) return error.message;
  return;
};

export const validRequiredString = (
  str: string,
  name: string
): string | undefined => {
  const validation = Joi.string().required().validate(str);

  const { error } = validation;

  if (error) return error.message.replace('value', name);
  return;
};

export const validBodyRule = (data: newRule): string | undefined => {
  const schema = Joi.object({
    listName: Joi.string().required(),
    rule: {
      name: Joi.string().required(),
      value: Joi.boolean().required(),
    },
  });

  const validation = schema.validate(data);
  const { error } = validation;

  if (error) return error.message;
  return;
};
