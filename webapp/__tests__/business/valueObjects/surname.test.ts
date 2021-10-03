import Surname from "../../../business/valueObjects/surname";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Surname", () => {

    it("creates surname", () => {
        const validation = Surname.create("Gonzalez");

        expect(validation.isSuccess()).toBeTruthy();
    });

    const validationTestCases: ValidationTestCase[] = [
        { 
            name: "does not create surname when the value is empty", 
            value: "", 
            expectedError: ValidationError.Required
        },
        { 
            name: "does not create surname when the length is too long", 
            value: 'a'.repeat(255), 
            expectedError: ValidationError.WrongLength
        }
    ]

    validationTestCases.forEach(testCase => {
        it(testCase.name, () => {
            const validation = Surname.create(testCase.value);

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
    expectedError: ValidationError
}