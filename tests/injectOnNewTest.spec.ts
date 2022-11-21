import { Message } from '../src/utils/message';
import { Fox } from './test-classes/injectOnNewClasses';
import { RedFox } from './test-classes/injectOnNewClasses';

Message.toggleConsolePrintable(false);

test('使用new的方式创建实例的依赖注入', () => {
    const redFox = new RedFox();

    expect(redFox.friend.name).toBe('blackRabbit');
    expect(redFox.friend1.name).toBe('blackRabbit');
    expect(redFox.friend2.name).toBe('whiteRabbit');
    expect(redFox.girlFriend.food.name).toBe('blackRabbit');

    expect(RedFox.id).toBe(1234);
    RedFox.id = 1;
    expect(RedFox.id).toBe(1);
    RedFox.changeId();
    expect(RedFox.id).toBe(4321);

    RedFox.myId = 2;
    expect(RedFox.id).toBe(2);
    expect(RedFox.myId).toBe(2);

    expect(Fox.partner.name).toBe('tiger');
    expect(Fox.lazyPartner.name).toBe('tiger');

    expect(redFox).toBeInstanceOf(RedFox);
    expect(redFox).toBeInstanceOf(Fox);
});
