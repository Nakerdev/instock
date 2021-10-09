import PasswordHashingService from "../../security/cryptography/passwordHashingService";
import UuidService from "../../security/cryptography/uuidService";
import TimeService from "../../infraestructure/timeService";
import UserRepository from "../userRepository";
import User from "../user";
import UserSignUpRequest from "./UserSignUpRequest";
import Either from "../../valueObjects/either";

export {
    UserSignUp,
    UserSignUpError
}

class UserSignUp {

    readonly userRepository: UserRepository;
    readonly passwordHashingService: PasswordHashingService;
    readonly uuidService: UuidService;
    readonly timeService: TimeService;

    constructor(
        userRepository: UserRepository,
        passwordHashingService: PasswordHashingService,
        uuidService: UuidService,
        timeService: TimeService,
    ){
        this.userRepository = userRepository;
        this.passwordHashingService = passwordHashingService;
        this.uuidService = uuidService;
        this.timeService = timeService;
    }

    async signUp(request: UserSignUpRequest): Promise<Either<UserSignUpError, User>>{
        if(this.userRepository.exist(request.email)) {
            return Either.left(UserSignUpError.UserAlreadyExist);
        }
        const user = await this.buildUser(request);
        this.userRepository.save(user);
        return Either.right(user);
    }

    private async buildUser(request: UserSignUpRequest): Promise<User> {
        const id = this.uuidService.create();
        const hashedPassword = await this.passwordHashingService.hash(request.password);
        const signUpDate = this.timeService.utcNow();
        return new User(
            id,
            request.email,
            hashedPassword,
            request.name,
            request.surname,
            signUpDate
        );
    }
}

enum UserSignUpError {
    UserAlreadyExist = "USER_ALREADY_EXIST"
}