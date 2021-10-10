import { isLeft, isRight, match } from "fp-ts/Either";
import { pipe } from "fp-ts/pipeable";

import Name from "../../../business/valueObjects/name";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Name", () => {

    it("creates name", () => {
        const result = Name.create("Alvaro");

        expect(isRight(result)).toBeTruthy();
    });

    const validationTestCases: ValidationTestCase[] = [
        { 
            name: "does not create name when the value is empty", 
            value: "", 
            expectedError: ValidationError.Required
        },
        { 
            name: "does not create name when the length is too long", 
            value: 'a'.repeat(255), 
            expectedError: ValidationError.WrongLength
        }
    ]

    validationTestCases.forEach(testCase => {
        it(testCase.name, () => {
            const result = Name.create(testCase.value);

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