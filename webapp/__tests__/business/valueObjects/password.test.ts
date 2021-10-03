import Password from "../../../business/valueObjects/password";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Password", () => {

    it("creates password", () => {
        const validation = Password.create("MyStr0ingPass*");

        expect(validation.isSuccess()).toBeTruthy();
    });

    const validationTestCases: ValidationTestCase[] = [
        { 
            name: "does not create password when the value is empty", 
            value: "", 
            expectedError: ValidationError.Required
        },
        { 
            name: "does not create password when the length is too short", 
            value: "M1Pass*", 
            expectedError: ValidationError.InvalidFormat
        },
        { 
            name: "does not create password when not includes at least one number", 
            value: "MyPassword*", 
            expectedError: ValidationError.InvalidFormat
        },
        { 
            name: "does not create password when not includes at least one uppercase letter", 
            value: "mypassw0rd*", 
            expectedError: ValidationError.InvalidFormat
        },
        { 
            name: "does not create password when not includes at least one non-char letter", 
            value: "mypassw0rd", 
            expectedError: ValidationError.InvalidFormat
        },
        { 
            name: "does not password when the length is too long", 
            value: 'a'.repeat(255) + "C0*", 
            expectedError: ValidationError.WrongLength
        }
    ]

    validationTestCases.forEach(testCase => {
        it(testCase.name, () => {
            const validation = Password.create(testCase.value);

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