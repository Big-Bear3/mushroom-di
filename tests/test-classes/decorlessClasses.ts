import { DependencyConfigEntity } from 'src/dependency-config/dependencyConfigEntity';
import { of, setAsDependencyConfig, setAsInjectable } from '../../src';

export class Nose {
    type: string;

    static {
        setAsDependencyConfig(Nose, (configEntity: DependencyConfigEntity<any, any[]>) => {
            configEntity.usingClass = LongNose;
        });
    }
}

export class LongNose extends Nose {
    override type = 'long';
}
setAsInjectable(LongNose);

export class ShortNose extends Nose {
    override type = 'short';

    static {
        setAsInjectable(ShortNose);
    }
}

export class Elephant {
    nose = of(Nose);

    static {
        setAsInjectable(Elephant, { type: 'singleton' });
    }
}
