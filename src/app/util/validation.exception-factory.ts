import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

const CONSTRAINT_CODES: Record<string, string> = {
  isEmail: "invalidEmail",
  isNotEmpty: "fieldRequired",
  isString: "mustBeString",
  isObject: "mustBeObject",
  minLength: "fieldTooShort",
  maxLength: "fieldTooLong",
  length: "invalidLength",
  isInt: "mustBeInteger",
  min: "valueTooSmall",
  max: "valueTooLarge",
  isIn: "invalidValue",
  isISO8601: "invalidDate",
  isArray: "mustBeArray",
  isEnum: "invalidValue",
  nestedValidation: "invalidNestedObject",
};

function isMessageCode(message: string) {
  return /^[a-z][a-zA-Z0-9]*$/.test(message);
}

function collectCodes(errors: ValidationError[]): string[] {
  const codes: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      for (const [constraint, message] of Object.entries(error.constraints)) {
        codes.push(isMessageCode(message) ? message : (CONSTRAINT_CODES[constraint] ?? "validationError"));
      }
    }

    if (error.children?.length) {
      codes.push(...collectCodes(error.children));
    }
  }

  return codes;
}

export function validationExceptionFactory(errors: ValidationError[]) {
  const codes = collectCodes(errors);

  return new BadRequestException(codes[0] ?? "validationError");
}
