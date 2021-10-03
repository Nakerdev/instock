import { UserSignUpRequest, UserSignUpRequestDto } from "../../../../business/users/signUp/UserSignUpRequest";
import Email from "../../../../business/valueObjects/email";
import Name from "../../../../business/valueObjects/name";
import Surname from "../../../../business/valueObjects/surname";
import Password from "../../../../business/valueObjects/password";
import { ValidationError } from "../../../../business/valueObjects/validationError";

describe("User SignUp Request", () => {

    it("creates request", () => {
        const requestDto = buildRequestDto({});

        const requestValidaiton = UserSignUpRequest.create(requestDto);

        expect(requestValidaiton.isSuccess()).toBeTruthy();
        expect(requestValidaiton.getSuccess()).toEqual({
            email: Email.create(requestDto.email).getSuccess(),
            name: Name.create(requestDto.name).getSuccess(),
            surname: Surname.create(requestDto.surname).getSuccess(),
            password: Password.create(requestDto.password).getSuccess()
        });
    });

    const validationErrorTestCases: ValidationErrorTestCase[] = [
        {
            name: "does not create request when email has validaiton errors",
            requestDto: buildRequestDto({email: ""}),
            expectedFieldId: "email"
        },
        {
            name: "does not create request when name has validaiton errors",
            requestDto: buildRequestDto({name: ""}),
            expectedFieldId: "name"
        },
        {
            name: "does not create request when surname has validaiton errors",
            requestDto: buildRequestDto({surname: ""}),
            expectedFieldId: "surname"
        },
        {
            name: "does not create request when password has validaiton errors",
            requestDto: buildRequestDto({password: ""}),
            expectedFieldId: "password"
        },
        {
            name: "does not create request when legal terms and conditions are not accepted",
            requestDto: buildRequestDto({areLegalTermsAndConditionsAccepted: false}),
            expectedFieldId: "legalTermsAndConditions",
            expectedError: ValidationError.Required
        }
    ];

    validationErrorTestCases.forEach(testCase => {
        it(testCase.name, () => {
            const requestValidaiton = UserSignUpRequest.create(testCase.requestDto);

            expect(requestValidaiton.isSuccess()).toBeFalsy();
            const errors = requestValidaiton.getFails();
            expect(errors.length).toBe(1);
            expect(errors[0].fieldId).toBe(testCase.expectedFieldId);
            if(testCase.expectedError){
                expect(errors[0].error).toBe(testCase.expectedError);
            }
        });
    });

    interface requestDtoBuilderParams {
        email?: string,
        name?: string,
        surname?: string,
        password?: string,
        areLegalTermsAndConditionsAccepted?: boolean
    }

    function buildRequestDto({
        email = "user@email.com",
        name = "Alvaro",
        surname = "Gonzalez",
        password = "MyStr0ngPass*",
        areLegalTermsAndConditionsAccepted = true,
    }: requestDtoBuilderParams): UserSignUpRequestDto {
        return new UserSignUpRequestDto(
            email,
            name,
            surname,
            password,
            areLegalTermsAndConditionsAccepted
        );
    }
});

interface ValidationErrorTestCase {
    name: string,
    requestDto: UserSignUpRequestDto,
    expectedFieldId: string,
    expectedError?: ValidationError
}