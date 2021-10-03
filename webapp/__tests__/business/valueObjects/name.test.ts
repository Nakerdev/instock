import Name from "../../../business/valueObjects/name";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Name", () => {

    it("creates name", () => {
        const validation = Name.create("Alvaro");

        expect(validation.isSuccess()).toBeTruthy();
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
            const validation = Name.create(testCase.value);

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