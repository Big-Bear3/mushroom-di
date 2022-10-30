import type { Class, NormalClass, ObjectKey, ObjectType } from '../types/diTypes';
import type { InjectOptions } from '../types/diTypes';

import { defaultInjectOptions } from '../constants/diConstants';
import { DependenciesSearcher } from './dependenciesSearcher';
import { DependenciesClassCollector } from '../../src/dependency-config/dependenciesClassCollector';
import { Message } from '../../src/utils/message';

interface InjectMembersInfo {
    members: {
        memberName: ObjectKey;
        definedClass: Class;
    }[];
    lazyMembers: {
        memberName: ObjectKey;
        definedClass: Class;
    }[];
    lazyMembersHandled: boolean;
}

/** 用于处理静态、非静态成员变量注入 */
export class InjectMembersHandler {
    private static _instance: InjectMembersHandler;

    /** 类和类中需要注入的非静态成员变量的映射 */
    private classToInjectMembers = new Map<Class, InjectMembersInfo>();

    /** 实例和实例中需要延迟注入的成员变量的映射 */
    private instanceToLazyInjectMembers = new WeakMap<ObjectType, ObjectType>();

    /** 添加类中需要注入的非静态成员变量 */
    addInjectMember(
        c: Class,
        memberName: ObjectKey,
        definedClass: Class,
        injectOptions: InjectOptions = defaultInjectOptions
    ): void {
        const targetInjectMembersInfo = this.classToInjectMembers.get(c);

        if (targetInjectMembersInfo) {
            if (injectOptions.lazy)
                targetInjectMembersInfo.lazyMembers.push({
                    memberName: memberName,
                    definedClass
                });
            else
                targetInjectMembersInfo.members.push({
                    memberName: memberName,
                    definedClass
                });
        } else {
            if (injectOptions.lazy)
                this.classToInjectMembers.set(c, {
                    members: [],
                    lazyMembers: [
                        {
                            memberName: memberName,
                            definedClass
                        }
                    ],
                    lazyMembersHandled: false
                });
            else
                this.classToInjectMembers.set(c, {
                    members: [
                        {
                            memberName: memberName,
                            definedClass
                        }
                    ],
                    lazyMembers: [],
                    lazyMembersHandled: false
                });
        }
    }

    /** 为类中以及其父类中所有非延迟注入的非静态成员变量注入依赖 */
    handleInstanceMembers(nc: NormalClass, instance: ObjectType): void {
        const injectMembersInfo = this.classToInjectMembers.get(nc.prototype);
        if (injectMembersInfo) {
            const dependenciesSearcher = DependenciesSearcher.instance;

            for (const memberInfo of injectMembersInfo.members) {
                instance[memberInfo.memberName] = dependenciesSearcher.searchDependency(memberInfo.definedClass);
            }
        }

        const parentClass = Object.getPrototypeOf(nc);
        if (parentClass) {
            this.handleInstanceMembers(parentClass, instance);
        }
    }

    /** 为类中以及其父类中所有延迟注入的非静态成员变量注入依赖 */
    handleInstanceLazyMembers(nc: NormalClass): void {
        const injectMembersInfo = this.classToInjectMembers.get(nc.prototype);
        if (injectMembersInfo && !injectMembersInfo.lazyMembersHandled) {
            const dependenciesSearcher = DependenciesSearcher.instance;
            const instanceToLazyInjectMembers = this.instanceToLazyInjectMembers;

            for (const memberInfo of injectMembersInfo.lazyMembers) {
                Reflect.defineProperty(nc.prototype, memberInfo.memberName, {
                    enumerable: true,
                    configurable: true,
                    get() {
                        let members = instanceToLazyInjectMembers.get(this);
                        if (members) {
                            if (Reflect.has(members, memberInfo.memberName)) return members[memberInfo.memberName];
                        } else {
                            members = {};
                            instanceToLazyInjectMembers.set(this, members);
                        }
                        const memberValue = dependenciesSearcher.searchDependency(memberInfo.definedClass);
                        members[memberInfo.memberName] = memberValue;
                        return memberValue;
                    },
                    set(value: unknown) {
                        const injectableOptions = DependenciesClassCollector.instance.getInjectableOptions(nc);
                        if (injectableOptions.setTo === 'frozen')
                            Message.throwError('29019', `该类 (${nc.name}) 的实例已置为frozen，无法对其属性重新赋值！`);

                        let members = instanceToLazyInjectMembers.get(this);
                        if (!members) {
                            members = {};
                            instanceToLazyInjectMembers.set(this, members);
                        }
                        members[memberInfo.memberName] = value;
                    }
                });
            }
        }

        const parentClass = Object.getPrototypeOf(nc);
        if (parentClass) {
            this.handleInstanceLazyMembers(parentClass);
        }
    }

    /** 为类中的静态成员变量注入依赖 */
    handleInstanceStaticMember(
        c: Class,
        memberName: ObjectKey,
        definedClass: Class,
        injectOptions: InjectOptions = defaultInjectOptions
    ): void {
        if (injectOptions.lazy) {
            let _value: unknown;
            let valueAlreadySet = false;

            Reflect.defineProperty(c, memberName, {
                enumerable: true,
                configurable: true,
                get() {
                    if (valueAlreadySet) return _value;

                    _value = DependenciesSearcher.instance.searchDependency(definedClass);
                    valueAlreadySet = true;

                    return _value;
                },
                set(value: unknown) {
                    const injectableOptions = DependenciesClassCollector.instance.getInjectableOptions(c);
                    if (injectableOptions.setTo === 'frozen')
                        Message.throwError('29020', `该类 (${c.name}) 的实例已置为frozen，无法对其属性重新赋值！`);

                    _value = value;
                    valueAlreadySet = true;
                }
            });
        } else {
            Reflect.set(c, memberName, DependenciesSearcher.instance.searchDependency(definedClass));
        }
    }

    static get instance(): InjectMembersHandler {
        if (!InjectMembersHandler._instance) {
            InjectMembersHandler._instance = new InjectMembersHandler();
        }
        return InjectMembersHandler._instance;
    }
}
