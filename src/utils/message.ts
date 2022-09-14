export class Message {
    static warn(...data: any[]): void {
        console.warn(...data);
    }

    static error(...data: any[]): void {
        console.error(...data);
    }

    static throwError(message: string, options?: ErrorOptions): void {
        throw new Error(message, options);
    }
}
