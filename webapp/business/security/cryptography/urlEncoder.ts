export default interface UrlEncoder {
    encode(text: string): string;
    decode(encodedText: string): string;
}
