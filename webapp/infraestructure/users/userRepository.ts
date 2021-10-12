import { PrismaClient } from "@prisma/client";
import { Option, none, some } from "fp-ts/Option";

import UserRepository from "../../business/users/userRepository";
import { User, UserPersistenceState } from "../../business/users/user";
import { Email, EmailPersistenceState } from "../../business/valueObjects/email";
import { PasswordPersistenceState } from "../../business/valueObjects/password";
import { NamePersistenceState } from "../../business/valueObjects/name";
import { SurnamePersistenceState } from "../../business/valueObjects/surname";

export default class UserPrismaRepository implements UserRepository {

    readonly prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async save(user: User): Promise<void>{
        try{
            await this.prisma.$connect;
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
        } finally {
            this.prisma.$disconnect;
        }
    }

    async searchBy(email: Email): Promise<Option<User>> {
        try{
            await this.prisma.$connect;
            const dbModel: DbUserModel | null = await this.prisma.user.findFirst({
                where: {
                    email: email.state.value
                }
            });
            if(dbModel === null) return none;
            return some(this.buildUser(dbModel));
        } finally {
            this.prisma.$disconnect;
        }
    }

    async exist(email: Email): Promise<boolean> {
        try{
            await this.prisma.$connect;
            const user = await this.prisma.user.findFirst({
                where: {
                    email: email.state.value
                }
            });
            return user !== null;
        } finally {
            this.prisma.$disconnect;
        }
    }

    private buildUser(dbModel: DbUserModel){
        const userState = new UserPersistenceState(
            dbModel.id,
            new EmailPersistenceState(dbModel.email),
            new PasswordPersistenceState(dbModel.password),
            new NamePersistenceState(dbModel.name),
            new SurnamePersistenceState(dbModel.surname),
            dbModel.signUpDate
        );
        return User.createFromState(userState);
    }
}

//TODO: Move this model to common place
interface DbUserModel {
    id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    signUpDate: Date;
}


