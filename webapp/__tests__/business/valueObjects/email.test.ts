import { isLeft, isRight, match } from "fp-ts/Either";
import { pipe } from "fp-ts/pipeable";

import Email from "../../../business/valueObjects/email";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Email", () => {

    it("creates email", () => {
        const result = Email.create("user@email.com");

        expect(isRight(result)).toBeTruthy();
    });

    const validationTestCases: ValidationTestCase[] = [
        { 
            name: "does not create email when the value is empty", 
            value: "", 
            expectedError: ValidationError.Required
        },
        { 
            name: "does not create email when the format is not valid", 
            value: "user@emailcom", 
            expectedError: ValidationError.InvalidFormat
        },
        { 
            name: "does not create email when the length is too long", 
            value: 'a'.repeat(255) + "@email.com", 
            expectedError: ValidationError.WrongLength
        }
    ]

    validationTestCases.forEach(testCase => {
        it(testCase.name, () => {
            const result = Email.create(testCase.value);

            expect(isLeft(result)).toBeTruthy();
            pipe(
                result,
                match(
                    error => expect(error).toBe(testCase.expectedError),
                    _ => expect(true).toBeFalsy()
                )
            );
        });
    })
});

interface ValidationTestCase {
    name: string,
    value: string, 
    expectedError: ValidationError,
}