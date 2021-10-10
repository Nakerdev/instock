import { PrismaClient } from "@prisma/client";

import UserRepository from "../../business/users/userRepository";
import { User } from "../../business/users/user";
import { Email } from "../../business/valueObjects/email";

export default class UserPrismaRepository implements UserRepository {

    readonly prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async save(user: User): Promise<void>{
        const userState = user.state;
        await this.prisma.user.create({
            data: {
                id: userState.id,
                email: userState.email.value,
                password: userState.password.value,
                name: userState.name.value,
                surname: userState.surname.value,
                signUpDate: userState.signUpDate
            }
        });
    }

    async exist(email: Email): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: email.state.value
            }
        });
        return user !== null;
    }
}


