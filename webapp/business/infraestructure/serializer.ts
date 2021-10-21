export default interface Serializer {
    serialize(obj: object): string;
    deserialize<T>(serilizedObj: string): T;
}