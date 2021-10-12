import {mock, MockProxy} from "jest-mock-extended";
import { some, none } from "fp-ts/Option";
import { isLeft, isRight, match } from "fp-ts/Either";
import { pipe } from "fp-ts/pipeable";

import PasswordHashingService from "../../../../business/security/cryptography/passwordHashingService";
import UserRepository from "../../../../business/users/userRepository";
import { UserLogin, UserLoginError } from "../../../../business/users/login/userLogin";
import { UserLoginRequest, UserLoginRequestDto } from "../../../../business/users/login/UserLoginRequest";
import { User } from "../../../../business/users/user";
import { Password, PasswordPersistenceState } from "../../../../business/valueObjects/password";
import { NamePersistenceState, Name } from "../../../../business/valueObjects/name";
import { Surname, SurnamePersistenceState } from "../../../../business/valueObjects/surname";
import { Email, EmailPersistenceState } from "../../../../business/valueObjects/email";

describe("User Login", () => {

    let userRepository: MockProxy<UserRepository>;
    let passwordHasingService: MockProxy<PasswordHashingService>;
    let command: UserLogin;

    beforeEach(() => {
        userRepository = mock<UserRepository>();
        passwordHasingService = mock<PasswordHashingService>();
        command = new UserLogin(
            userRepository,
            passwordHasingService
        );
    })

    it("logins user", async () => {
        const passwordIntent = "UserPassw0rdIntent!";
        const request = <UserLoginRequest>buildRequest({password: passwordIntent});
        const userHashedPassword = "hashed-password";
        const user = buildUser({password: userHashedPassword});
        userRepository.searchBy
            .calledWith(request.email)
            .mockResolvedValue(some(user));
        passwordHasingService.compare
            .calledWith(userHashedPassword, passwordIntent)
            .mockResolvedValue(true);

        var result = await command.login(request);

        expect(isRight(result)).toBeTruthy();
        pipe(
            result,
            match(
                _ => expect(true).toBeFalsy(),
                loggedUser => expect(loggedUser).toBe(user)
            )
        );
    });

    it("does not login user when credentials are invalid", async () => {
        const request = <UserLoginRequest>buildRequest({});
        userRepository.searchBy
            .mockResolvedValue(some(buildUser({})));
        passwordHasingService.compare
            .mockResolvedValue(false);

        const result = await command.login(request);

        expect(isLeft(result)).toBeTruthy();
        pipe(
            result,
            match(
                error => expect(error).toBe(UserLoginError.InvalidCredentials),
                _ => expect(true).toBeFalsy()
            )
        );
    });

    it("does not login user when user not found", async () => {
        const request = <UserLoginRequest>buildRequest({});
        userRepository.searchBy
            .mockResolvedValue(none);

        const result = await command.login(request);

        expect(isLeft(result)).toBeTruthy();
        pipe(
            result,
            match(
                error => expect(error).toBe(UserLoginError.UserNotFound),
                _ => expect(true).toBeFalsy()
            )
        );
    });

    interface UserBuilderParams {
        password?: string;
    }

    function buildUser({
        password = "hashed-password"
    }): User {
        return new User(
            "id", 
            Email.createFromState(new EmailPersistenceState("user@email.com")),
            Password.createFromState(new PasswordPersistenceState(password)),
            Name.createFromState(new NamePersistenceState("Alvaro")),
            Surname.createFromState(new SurnamePersistenceState("Gonzalez")),
            new Date(2021, 10, 10)
        )
    }

    interface RequestBuilderParams {
        password?: string;
    }

    function buildRequest({
        password = "MyStr0ngPass*"
    }: RequestBuilderParams): UserLoginRequest | null {

        const requestDto = new UserLoginRequestDto(
            "user@email.com",
            password,
        );
        return pipe(
            UserLoginRequest.create(requestDto),
            match(
                _ => null,
                request => request
            )
        );
    }
});