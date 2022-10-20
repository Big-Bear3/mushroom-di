import type { Class, NormalClass, ObjectType } from '../types/diTypes';
import type { InjectOptions } from '../types/diTypes';

import { defaultInjectOptions } from '../constants/diConstants';
import { DependenciesSearcher } from './dependenciesSearcher';

interface InjectMembersInfo {
    members: {
        memberName: string | symbol | number;
        definedClass: Class;
    }[];
    lazyMembers: {
        memberName: string | symbol | number;
        definedClass: Class;
    }[];
    lazyMembersHandled: boolean;
}

/** 用于处理静态、非静态成员变量注入 */
export class InjectMembersHandler {
    private static instance: InjectMembersHandler;

    /** 类和类中需要注入的非静态成员变量的映射 */
    private classToInjectMembers = new Map<Class, InjectMembersInfo>();

    /** 实例和实例中需要延迟注入的成员变量的映射 */
    private instanceToLazyInjectMembers = new WeakMap<ObjectType, ObjectType>();

    /** 添加类中需要注入的非静态成员变量 */
    addInjectMember(
        c: Class,
        memberName: string | symbol | number,
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
            const dependenciesSearcher = DependenciesSearcher.getInstance();

            for (const memberInfo of injectMembersInfo.members) {
                instance[memberInfo.memberName] = memberInfo.definedClass
                    ? dependenciesSearcher.searchDependency(memberInfo.definedClass)
                    : /* istanbul ignore next */
                      undefined;
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
            const dependenciesSearcher = DependenciesSearcher.getInstance();
            const instanceToLazyInjectMembers = this.instanceToLazyInjectMembers;

            for (const memberInfo of injectMembersInfo.lazyMembers) {
                if (memberInfo.definedClass) {
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
                            let members = instanceToLazyInjectMembers.get(this);
                            if (!members) {
                                members = {};
                                instanceToLazyInjectMembers.set(this, members);
                            }
                            members[memberInfo.memberName] = value;
                        }
                    });
                } else {
                    Reflect.set(nc.prototype, memberInfo.memberName, undefined);
                }
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
        memberName: string | symbol,
        definedClass: Class,
        injectOptions: InjectOptions = defaultInjectOptions
    ): void {
        if (injectOptions.lazy && definedClass) {
            let _value: unknown;
            let valueAlreadySet = false;

            Reflect.defineProperty(c, memberName, {
                enumerable: true,
                configurable: true,
                get() {
                    if (valueAlreadySet) return _value;

                    _value = DependenciesSearcher.getInstance().searchDependency(definedClass);
                    valueAlreadySet = true;

                    return _value;
                },
                set(value: unknown) {
                    _value = value;
                    valueAlreadySet = true;
                }
            });
        } else {
            if (definedClass) Reflect.set(c, memberName, DependenciesSearcher.getInstance().searchDependency(definedClass));
            else Reflect.set(c, memberName, undefined);
        }
    }

    static getInstance(): InjectMembersHandler {
        if (!InjectMembersHandler.instance) {
            InjectMembersHandler.instance = new InjectMembersHandler();
        }
        return InjectMembersHandler.instance;
    }
}
