import { User } from "./user";
import { Email } from "../valueObjects/email";

export default interface UserRepository {
    save(user: User): Promise<void>;
    exist(email: Email): Promise<boolean>;
}