import User from "./user";

export default interface UserInterface {
    save(user: User): void;
}