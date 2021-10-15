import { Option } from 'fp-ts/Option'

import { User } from './user'
import { Email } from '../valueObjects/email'

export default interface UserRepository {
    save(user: User): Promise<void>;
    searchBy(email: Email): Promise<Option<User>>;
    exist(email: Email): Promise<boolean>;
}
