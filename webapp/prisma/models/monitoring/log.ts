export default interface Log {
    source: string;
    level: string;
    message: string;
    exception: string;
    createdAt: Date;
}
