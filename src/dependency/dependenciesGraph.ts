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

            this.valueToNode.set(currentNode.value, currentNode);

            return undefined;
        }
        parentNode.addNextNode(currentNode);
        return this.checkRing(currentNode);
    }

    private checkRing(targetNode: DependencyNode): Class[] {
        const pendingNodes: { value: DependencyNode; path: Class[] }[] = [
            {
                value: targetNode,
                path: [targetNode.value]
            }
        ];

        let isFirstLoop = true;

        while (pendingNodes.length > 0) {
            const currentNode = pendingNodes.pop();
            if (!isFirstLoop && currentNode.value === targetNode) return currentNode.path;

            if (currentNode.value.nextNodesCount() > 0) {
                for (const nextNode of currentNode.value.nextNodes) {
                    pendingNodes.push({
                        value: nextNode,
                        path: [...currentNode.path, nextNode.value]
                    });
                }
            }

            if (isFirstLoop) isFirstLoop = false;
        }

        return undefined;
    }
}

export class DependencyNode {
    value: Class;
    nextNodes: Set<DependencyNode>;

    constructor(value: Class) {
        this.value = value;
    }

    addNextNode(node: DependencyNode) {
        if (!this.nextNodes) this.nextNodes = new Set();
        this.nextNodes.add(node);
    }

    nextNodesCount() {
        return this.nextNodes ? this.nextNodes.size : 0;
    }
}
