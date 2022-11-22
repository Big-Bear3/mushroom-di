import { of, setAsInjectable } from '../src';
import { Message } from '../src/utils/message';
import { Elephant } from './test-classes/decorlessClasses';

Message.toggleConsolePrintable(false);

test('无装饰器的情况下使用', () => {
    const elephant = of(Elephant);
    const elephant2 = of(Elephant);

    expect(elephant === elephant2).toBe(true);
    expect(elephant.nose.type).toBe('long');
});

test('禁止重复设置注入选项', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        setAsInjectable(Elephant, { type: 'singleton' });
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('29022');
});
