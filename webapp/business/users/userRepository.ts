import { Option } from 'fp-ts/Option'

import { User } from './user'
import { Email } from '../valueObjects/email'
import { UserId } from '../valueObjects/userId'

export default interface UserRepository {
    save(user: User): Promise<void>;
    update(user: User): Promise<void>;
    searchByEmail(email: Email): Promise<Option<User>>;
    searchById(id: UserId): Promise<Option<User>>;
    exist(email: Email): Promise<boolean>;
}
