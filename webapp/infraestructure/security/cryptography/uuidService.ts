import { v1 as uuidV1 } from "uuid";

import UuidService from "../../../business/security/cryptography/uuidService";

export default class SystemUuidService implements UuidService {
    create(): string {
        return uuidV1();
    }
} 