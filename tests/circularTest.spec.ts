import { Message } from '../src/utils/message';
import { CircularClassA, toggleCircularSwitch1 } from './test-classes/circularClasses';

Message.toggleConsolePrintable(false);

test('检测循环依赖', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    toggleCircularSwitch1(false);

    try {
        const a = of(CircularClassA);
    } catch (error) {}

    expect(messageHistory).toHaveLength(0);

    toggleCircularSwitch1(true);

    try {
        const a = of(CircularClassA);
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('39002');
});
