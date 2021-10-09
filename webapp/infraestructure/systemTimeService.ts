import TimeService from "../business/infraestructure/timeService";

export default class SystemTimeService implements TimeService {
    utcNow(): Date{
        return new Date();
    };
}