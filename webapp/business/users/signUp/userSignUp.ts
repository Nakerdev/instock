import PasswordHashingService from "../../security/cryptography/passwordHashingService";
import UuidService from "../../security/cryptography/uuidService";
import TimeService from "../../infraestructure/timeService";
import UserRepository from "../userRepository";
import User from "../user";

export {
    UserSignUp,
    UserSignUpRequest
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

    signUp(request: UserSignUpRequest){
        const user = this.buildUser(request);
        this.userRepository.save(user);
    }

    private buildUser(request: UserSignUpRequest): User {
        const id = this.uuidService.create();
        const hashedPassword = this.passwordHashingService.hash(request.password);
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

class UserSignUpRequest {
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly password: string;
    readonly areLegalTermsAndConditionsAccepted: boolean;

    constructor(
        email: string, 
        name: string, 
        surname: string, 
        password: string,
        areLegalTermsAndConditionsAccepted: boolean
    ) {

        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted;
    }
}