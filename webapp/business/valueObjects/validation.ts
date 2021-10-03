export default class Validation<Fail, Success> {

    readonly fail: Fail[];
    readonly success?: Success;

    static success<FailT, SuccessT>(success: SuccessT): Validation<FailT, SuccessT> {
        return new Validation([], success);
    }

    static fail<FailT, SuccessT>(fails: FailT[]): Validation<FailT, SuccessT> {
        return new Validation(fails);
    }

    private constructor(
        fail: Fail[],
        success?: Success,
    ){
        this.fail = fail;
        this.success = success;
    }

    isSuccess(): boolean{
        return this.fail.length === 0 && (this.success !== null || this.success !== undefined);
    }

    isFail(): boolean{
        return this.fail.length > 0;
    }

    getFails(): Fail[]{
        return this.fail;
    }
}