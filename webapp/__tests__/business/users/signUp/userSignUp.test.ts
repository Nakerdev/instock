import {mock, MockProxy} from "jest-mock-extended";

import { UserSignUp, UserSignUpRequest } from "../../../../business/users/signUp/userSignUp";
import PasswordHashingService from "../../../../business/security/cryptography/passwordHashingService";
import UuidService from "../../../../business/security/cryptography/uuidService";
import TimeService from "../../../../business/infraestructure/timeService";
import UserRepository from "../../../../business/users/userRepository";

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

    it("signs up user", () => {
        const request = buildRequest();
        const uuid = "deb74e35-ea5f-535f-890f-5779b5d8e27f"
        uuidService.create
            .mockReturnValue(uuid);
        const hashedPassword = "hashed-password"
        passwordHasingService.hash
            .calledWith(request.password)
            .mockReturnValue(hashedPassword);
        const utcNow = new Date(2021, 10, 10);
        timeService.utcNow
            .mockReturnValue(utcNow);

        command.signUp(request);

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

    it("does not signup user when user with the same email already exist", () => {
        const request = buildRequest();
        userRepository.exist
            .calledWith(request.email)
            .mockReturnValue(true);

        command.signUp(request);

        expect(userRepository.save).not.toHaveBeenCalled()
    });

    function buildRequest(): UserSignUpRequest {
        return new UserSignUpRequest(
            "user@email.com",
            "Alvaro",
            "Gonzalez",
            "SecurePassword*",
            true
        );
    }
});