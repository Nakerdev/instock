import Email from "../../../business/valueObjects/email";
import { ValidationError } from "../../../business/valueObjects/validationError";

describe("Email", () => {

    it("creates email", () => {
        const validation = Email.create("user@email.com");

        expect(validation.isSuccess()).toBeTruthy();
    });

    it("does not create email when the value is empty", () => {
        const validation = Email.create("");

        expect(validation.isFail()).toBeTruthy();
        const fails = validation.getFails();
        expect(fails.length).toBe(1);
        expect(fails[0]).toBe(ValidationError.Required);
    });

    it("does not create email when the format is not valid", () => {
        const validation = Email.create("user@emailcom");

        expect(validation.isFail()).toBeTruthy();
        const fails = validation.getFails();
        expect(fails.length).toBe(1);
        expect(fails[0]).toBe(ValidationError.InvalidFormat);
    });

    it("does not create email when the length is too long", () => {
        const validation = Email.create('a'.repeat(255) + "@email.com");

        expect(validation.isFail()).toBeTruthy();
        const fails = validation.getFails();
        expect(fails.length).toBe(1);
        expect(fails[0]).toBe(ValidationError.WrongLength);
    });
});