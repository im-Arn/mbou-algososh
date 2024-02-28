export default class Queue<T> {
  private container: (T)[] = [];
  private head: number = 0;
  private tail: number = 0;
  private length: number = 0;
  private maxSize: number = 4;
  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.container = new Array(this.maxSize).fill(undefined);
  }
  enqueue = (i: T) => {
    if (this.length >= this.maxSize) {
      throw new Error("Maximum length error");
    }
    this.container[this.tail % this.maxSize] = i;
    this.tail++;
    this.length++;
    console.log("+", this.length, this.head, this.tail, this.container);
  };

  getElements = () => {
    return this.container;
  };

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    const deletedItem = this.container[this.head % this.maxSize];
    // this.container[this.head % this.maxSize] = null;
    delete this.container[this.head % this.maxSize];
    this.head++;
    this.length--;
    if (this.head >= this.maxSize){ //для возможности заполнения новой очереди сразу как будет удалён последний элемент предыдущей
      this.clear();
    }
    console.log("-", this.length, this.head, this.tail, this.container);
    return deletedItem;
  }

  clear(): void {
    this.container = new Array(this.maxSize).fill(undefined);
    this.head = 0;
    this.tail = 0;
    this.length = 0;
    console.log("clear", this.length, this.head, this.tail, this.container);
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  elements = (): (T | undefined)[] => {
    return this.container.slice();
  }

  getLength = () => { return this.length; }

  getHead(): number {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.head;
  }

  getTail(): number {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.tail;
  }
}
