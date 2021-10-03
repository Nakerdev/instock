import Email from "../../../business/valueObjects/email";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Email", () => {

    it("creates email", () => {
        const validation = Email.create("user@email.com");

        expect(validation.isSuccess()).toBeTruthy();
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
            const validation = Email.create(testCase.value);

            expect(validation.isFail()).toBeTruthy();
            const fails = validation.getFails();
            expect(fails.length).toBe(1);
            expect(fails[0]).toBe(testCase.expectedError);
        });
    })
});

interface ValidationTestCase {
    name: string,
    value: string, 
    expectedError: ValidationError,
}