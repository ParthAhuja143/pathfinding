class MinPriorityQueue {
    constructor() {
        this.heap = [null];
    }
    insert(item, priority) {
        this.heap.push({
            item,
            priority,
        });
        if (this.heap.length > 1) {
            let current = this.heap.length - 1;
            let parent = Math.floor(current / 2);
            while (current > 1 && this.heap[parent].priority > this.heap[current].priority) {
                let savedCurrent = this.heap[current];
                let savedParent = this.heap[parent];
                this.heap[current] = savedParent;
                this.heap[parent] = savedCurrent;
                current = parent;
                parent = Math.floor(current / 2);
            }
        }
    }
    remove() {
        let topElement = this.heap[1] ? this.heap[1].item : undefined;
        if (this.heap.length === 2) {
            this.heap.pop();
            return topElement;
        } else if (this.heap.length === 1) {
            return topElement;
        } else {
            this.heap[1] = this.heap.pop();
        }
        let current = 1;
        let leftChild = 2;
        let rightChild = 3;
        if (this.heap[leftChild] === undefined) {
            return topElement;
        }
        while (Math.min(this.heap[leftChild].priority, (this.heap[rightChild] ? 
            this.heap[rightChild].priority : Number.POSITIVE_INFINITY)) < this.heap[current].priority) {
            if (this.heap[leftChild].priority < (this.heap[rightChild] ? 
                this.heap[rightChild].priority : Number.POSITIVE_INFINITY)) {
                let savedParent = this.heap[current];
                let savedChild = this.heap[leftChild];
                this.heap[current] = savedChild;
                this.heap[leftChild] = savedParent;
                current = leftChild;
            }
            else {
                let savedParent = this.heap[current];
                let savedChild = this.heap[rightChild];
                this.heap[current] = savedChild;
                this.heap[rightChild] = savedParent;
                current = rightChild;
            }
            leftChild = 2 * current;
            rightChild = 2 * current + 1;
            if (!this.heap[leftChild] && !this.heap[rightChild]) {
                break;
            }
        }
        return topElement;
    }
    peek() {
        return this.heap[1] ? this.heap[1].item : undefined;
    }
    isEmpty() {
        return this.heap.length === 1;
    }
    length() {
        return this.heap.length - 1;
    }
    getHeap() {
        return this.heap;
    }
}

export {MinPriorityQueue};