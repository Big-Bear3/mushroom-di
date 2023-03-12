import type { Class, NormalClass, ObjectKey, ObjectType } from '../types/diTypes';
import type { InjectOptions } from '../types/diTypes';

import { DiConstants } from '../constants/diConstants';
import { DependenciesSearcher } from './dependenciesSearcher';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { Message } from '../utils/message';

interface InjectMembersInfo {
    members: {
        memberName: ObjectKey;
        definedClassOrSymbol: Class | symbol;
    }[];
    lazyMembers: {
        memberName: ObjectKey;
        definedClassOrSymbol: Class | symbol;
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
        definedClassOrSymbol: Class | symbol,
        injectOptions: InjectOptions = DiConstants.defaultInjectOptions
    ): void {
        const targetInjectMembersInfo = this.classToInjectMembers.get(c);

        if (targetInjectMembersInfo) {
            if (injectOptions.lazy)
                targetInjectMembersInfo.lazyMembers.push({
                    memberName: memberName,
                    definedClassOrSymbol
                });
            else
                targetInjectMembersInfo.members.push({
                    memberName: memberName,
                    definedClassOrSymbol
                });
        } else {
            if (injectOptions.lazy)
                this.classToInjectMembers.set(c, {
                    members: [],
                    lazyMembers: [
                        {
                            memberName: memberName,
                            definedClassOrSymbol
                        }
                    ],
                    lazyMembersHandled: false
                });
            else
                this.classToInjectMembers.set(c, {
                    members: [
                        {
                            memberName: memberName,
                            definedClassOrSymbol
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
                if (typeof memberInfo.definedClassOrSymbol === 'symbol') {
                    instance[memberInfo.memberName] = dependenciesSearcher.searchDependencyBySymbol(
                        memberInfo.definedClassOrSymbol
                    );
                } else {
                    instance[memberInfo.memberName] = dependenciesSearcher.searchDependencyByClass(
                        memberInfo.definedClassOrSymbol
                    );
                }
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

                        let memberValue: unknown;
                        if (typeof memberInfo.definedClassOrSymbol === 'symbol') {
                            memberValue = dependenciesSearcher.searchDependencyBySymbol(memberInfo.definedClassOrSymbol);
                        } else {
                            memberValue = dependenciesSearcher.searchDependencyByClass(memberInfo.definedClassOrSymbol);
                        }

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
        definedClassOrSymbol: Class | symbol,
        injectOptions: InjectOptions = DiConstants.defaultInjectOptions
    ): void {
        if (injectOptions.lazy) {
            let _value: unknown;
            let valueAlreadySet = false;

            Reflect.defineProperty(c, memberName, {
                enumerable: true,
                configurable: true,
                get() {
                    if (valueAlreadySet) return _value;

                    if (typeof definedClassOrSymbol === 'symbol') {
                        _value = DependenciesSearcher.instance.searchDependencyBySymbol(definedClassOrSymbol);
                    } else {
                        _value = DependenciesSearcher.instance.searchDependencyByClass(definedClassOrSymbol);
                    }

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
            if (typeof definedClassOrSymbol === 'symbol') {
                Reflect.set(c, memberName, DependenciesSearcher.instance.searchDependencyBySymbol(definedClassOrSymbol));
            } else {
                Reflect.set(c, memberName, DependenciesSearcher.instance.searchDependencyByClass(definedClassOrSymbol));
            }
        }
    }

    static get instance(): InjectMembersHandler {
        if (!InjectMembersHandler._instance) {
            InjectMembersHandler._instance = new InjectMembersHandler();
        }
        return InjectMembersHandler._instance;
    }
}
