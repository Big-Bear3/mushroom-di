import { of } from '../src';
import { Message } from '../src/utils/message';
import { Elephant } from './test-classes/decorlessClasses';

Message.toggleConsolePrintable(false);

test('无装饰器的情况下使用', () => {
    const elephant = of(Elephant);
    const elephant2 = of(Elephant);

    expect(elephant === elephant2).toBe(true);
    expect(elephant.nose.type).toBe('long');
});
