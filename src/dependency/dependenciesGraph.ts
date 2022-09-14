import { Message } from '@/utils/message';

export class DependenciesGraph {
    private initialNode: DependencyNode;
    private valueToNode: Map<Class, DependencyNode>;

    constructor() {}

    addNodeAndCheckRing(currentNodeValue: Class, parentNodeValue: Class): Class[] {
        if (!parentNodeValue) {
            this.initialNode = new DependencyNode(currentNodeValue);

            this.valueToNode = new Map();
            this.valueToNode.set(currentNodeValue, this.initialNode);
            return undefined;
        }

        const parentNode = this.valueToNode.get(parentNodeValue);
        let currentNode = this.valueToNode.get(currentNodeValue);
        if (!currentNode) {
            currentNode = new DependencyNode(currentNodeValue);
            parentNode.addNextNode(currentNode);
            return undefined;
        }
        parentNode.addNextNode(currentNode);
        return this.checkRing(currentNode);
    }

    private checkRing(currentNode: DependencyNode): Class[] {
        const path = [];
        return undefined;
    }
}

export class DependencyNode {
    value: Class;
    nextNodes: Set<DependencyNode>;

    constructor(value: Class) {
        this.value = value;
        this.nextNodes = new Set();
    }

    addNextNode(node: DependencyNode) {
        this.nextNodes.add(node);
    }
}
