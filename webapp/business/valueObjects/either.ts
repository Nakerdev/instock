type Left<L> = { kind: "left"; leftValue: L };
type Right<R> = { kind: "right"; rightValue: R };

type EitherValue<L, R> = Left<L> | Right<R>;

export default class Either<L, R> {

    static left<L, R>(value: L) {
        return new Either<L, R>({ kind: "left", leftValue: value });
    }

    static right<L, R>(value: R) {
        return new Either<L, R>({ kind: "right", rightValue: value });
    }

    private constructor(private readonly value: EitherValue<L, R>) { }

    isLeft(): boolean {
        return this.value.kind === "left";
    }
    isRight(): boolean {
        return this.value.kind === "right";
    }

    getLeft(): L {
        if(this.value.kind === "left"){
            return this.value.leftValue;
        }
        throw new Error("Invalid operation, object state is in a invalid state.")
    }

    getRight(): R {
        if(this.value.kind === "right"){
            return this.value.rightValue;
        }
        throw new Error("Invalid operation, object state is in a invalid state.")
    }
}