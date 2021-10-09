import {mock, MockProxy} from "jest-mock-extended";
import { isLeft, isRight, match } from "fp-ts/Either";
import { pipe } from "fp-ts/pipeable";

import { UserSignUp, UserSignUpError } from "../../../../business/users/signUp/userSignUp";
import { UserSignUpRequest, UserSignUpRequestDto } from "../../../../business/users/signUp/UserSignUpRequest";
import PasswordHashingService from "../../../../business/security/cryptography/passwordHashingService";
import UuidService from "../../../../business/security/cryptography/uuidService";
import TimeService from "../../../../business/infraestructure/timeService";
import UserRepository from "../../../../business/users/userRepository";
import Password from "../../../../business/valueObjects/password";

describe("User SignUp", () => {

    let userRepository: MockProxy<UserRepository>;
    let passwordHasingService: MockProxy<PasswordHashingService>;
    let uuidService: MockProxy<UuidService>;
    let timeService: MockProxy<TimeService>;
    let command: UserSignUp;

    beforeEach(() => {
        userRepository = mock<UserRepository>();
        passwordHasingService = mock<PasswordHashingService>();
        uuidService = mock<UuidService>();
        timeService = mock<TimeService>();
        command = new UserSignUp(
            userRepository,
            passwordHasingService,
            uuidService,
            timeService 
        );
    })

    it("signs up user", async () => {
        const request = buildRequest();
        const uuid = "deb74e35-ea5f-535f-890f-5779b5d8e27f"
        uuidService.create
            .mockReturnValue(uuid);
        const hashedPassword = Password.createFromBusiness("$2a$12$pBJwF27FLEY1RQSh428lX.1hwwh9uHdgGyM7il6C/cVa2/wbAdzKC")
        passwordHasingService.hash
            .calledWith(request.password)
            .mockResolvedValue(hashedPassword);
        const utcNow = new Date(2021, 10, 10);
        timeService.utcNow
            .mockReturnValue(utcNow);

        var result = await command.signUp(request);

        expect(isRight(result)).toBeTruthy();
        pipe(
            result,
            match(
                _ => expect(true).toBeFalsy(),
                createdUser => expect(createdUser.id).toBe(uuid)
            )
        );
        expect(userRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: uuid,
                email: request.email,
                name: request.name,
                surname: request.surname,
                password: hashedPassword,
                signUpDate: utcNow
            })
        )
    });

    it("does not signup user when user with the same email already exist", async () => {
        const request = buildRequest();
        userRepository.exist
            .calledWith(request.email)
            .mockReturnValue(true);

        const result = await command.signUp(request);

        expect(isLeft(result)).toBeTruthy();
        pipe(
            result,
            match(
                error => expect(error).toBe(UserSignUpError.UserAlreadyExist),
                _ => expect(true).toBeFalsy()
            )
        );
        expect(userRepository.save).not.toHaveBeenCalled()
    });

    function buildRequest(): UserSignUpRequest {
        const requestDto = new UserSignUpRequestDto(
            "user@email.com",
            "Alvaro",
            "Gonzalez",
            "MyStr0ngPass*",
            true
        );
        return UserSignUpRequest.create(requestDto).getSuccess();
    }
});