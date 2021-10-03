import User from "./user";
import Email from "../valueObjects/email";

export default interface UserInterface {
    save(user: User): void;
    exist(email: Email): boolean;
}