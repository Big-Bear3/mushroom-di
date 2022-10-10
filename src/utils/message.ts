/**
 * 错误码规则：
 * 第一位：0.初始化问题 1.运行时内部问题 2.用户使用问题 3.执行用户代码问题
 * 第二位：0.警告 1.错误 9.抛异常
 */
export class Message {
    private static consolePrintable = true;

    private static histories: {
        type: 'warn' | 'error' | 'throw';
        code: string;
        message: string;
    }[] = [];

    static warn(code: string, message: string): void {
        Message.histories.push({ type: 'warn', code, message });

        if (Message.consolePrintable) console.warn(`(${code}) ${message}`);
    }

    static error(code: string, message: string): void {
        Message.histories.push({ type: 'error', code, message });

        if (Message.consolePrintable) console.error(`(${code}) ${message}`);
    }

    static throwError(code: string, message: string): void {
        Message.histories.push({ type: 'throw', code, message });

        if (Message.consolePrintable) throw new Error(`(${code}) ${message}`);
        else throw new Error();
    }

    static getHistory() {
        return Message.histories;
    }

    static clearHistory(): void {
        Message.histories.splice(0);
    }

    static toggleConsolePrintable(consolePrintable: boolean): void {
        Message.consolePrintable = consolePrintable;
    }
}
