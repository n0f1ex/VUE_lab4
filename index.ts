// 1. Класс User + типизация через интерфейс
interface IUser {
    name: string;
    age: number;
    hello(): void;
}

class User implements IUser {
    constructor(public name: string, public age: number) {}

    hello(): void {
        console.log(`Hi! My name is ${this.name}. And I am ${this.age} years old.`);
    }
}

// 2. Типизация того же класса через псевдоним типа
type UserType = {
    name: string;
    age: number;
    hello(): void;
};

// Класс может реализовывать и интерфейс, и псевдоним типа одновременно
class UserWithTypeAlias implements UserType {
    constructor(public name: string, public age: number) {}

    hello(): void {
        console.log(`Hi! My name is ${this.name}. And I am ${this.age} years old.`);
    }
}

// 3. Перегруженная функция distance
interface Point {
    x: number;
    y: number;
}

// Вспомогательный type-guard для строгой проверки без `as`
function isPoint(val: number | Point): val is Point {
    return typeof val === "object" && val !== null && "x" in val && "y" in val;
}

// Сигнатуры перегрузок
function distance(x1: number, y1: number, x2: number, y2: number): number;
function distance(p1: Point, p2: Point): number;

// Реализация
function distance(a: number | Point, b: number | Point, c?: number, d?: number): number {
    if (isPoint(a) && isPoint(b)) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }
    if (typeof a === "number" && typeof b === "number" && typeof c === "number" && typeof d === "number") {
        return Math.sqrt(Math.pow(b - a, 2) + Math.pow(d - c, 2));
    }
    throw new Error("Некорректные аргументы");
}

// 4. Бинарное дерево поиска
class TreeNode {
    constructor(
        public value: number,
        public left: TreeNode | null = null,
        public right: TreeNode | null = null
    ) {}
}

class BinarySearchTree {
    private root: TreeNode | null = null;

    insert(value: number): void {
        this.root = this.insertRec(this.root, value);
    }

    private insertRec(node: TreeNode | null, value: number): TreeNode {
        if (node === null) return new TreeNode(value);
        if (value < node.value) node.left = this.insertRec(node.left, value);
        else node.right = this.insertRec(node.right, value);
        return node;
    }

    search(value: number): boolean {
        return this.searchRec(this.root, value);
    }

    private searchRec(node: TreeNode | null, value: number): boolean {
        if (node === null) return false;
        if (value === node.value) return true;
        return value < node.value ? this.searchRec(node.left, value) : this.searchRec(node.right, value);
    }

    delete(value: number): boolean {
        if (this.root === null) return false;
        if (!this.searchRec(this.root, value)) return false;
        this.root = this.deleteRec(this.root, value);
        return true;
    }

    private deleteRec(node: TreeNode | null, value: number): TreeNode | null {
        if (node === null) return null;
        if (value < node.value) node.left = this.deleteRec(node.left, value);
        else if (value > node.value) node.right = this.deleteRec(node.right, value);
        else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;
            
            const minVal = this.getMinValue(node.right);
            node.value = minVal;
            node.right = this.deleteRec(node.right, minVal);
        }
        return node;
    }

    private getMinValue(node: TreeNode | null): number {
        if (node === null) throw new Error("Узел не может быть null");
        let current: TreeNode = node;
        while (current.left !== null) current = current.left;
        return current.value;
    }

    update(oldValue: number, newValue: number): boolean {
        if (this.delete(oldValue)) {
            this.insert(newValue);
            return true;
        }
        return false;
    }

    height(): number {
        return this.heightRec(this.root);
    }

    private heightRec(node: TreeNode | null): number {
        if (node === null) return 0;
        return 1 + Math.max(this.heightRec(node.left), this.heightRec(node.right));
    }
}

// 5. Паттерны: Adapter, Strategy, Observer

// Adapter
interface ITarget {
    request(): string;
}

class Adaptee {
    specificRequest(): string {
        return "Legacy response";
    }
}

class Adapter implements ITarget {
    constructor(private adaptee: Adaptee) {}

    request(): string {
        return `Adapter: ${this.adaptee.specificRequest()}`;
    }
}

// Strategy
interface IStrategy {
    execute(a: number, b: number): number;
}

class AddStrategy implements IStrategy {
    execute(a: number, b: number): number { return a + b; }
}

class MultiplyStrategy implements IStrategy {
    execute(a: number, b: number): number { return a * b; }
}

class StrategyContext {
    constructor(private strategy: IStrategy) {}

    setStrategy(strategy: IStrategy): void {
        this.strategy = strategy;
    }

    execute(a: number, b: number): number {
        return this.strategy.execute(a, b);
    }
}

// Observer
interface IObserver {
    update(data: string): void;
}

interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(): void;
}

class Subject implements ISubject {
    private observers: IObserver[] = [];
    private state: string = "";

    attach(observer: IObserver): void {
        this.observers.push(observer);
    }

    detach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) this.observers.splice(index, 1);
    }

    notify(): void {
        for (const obs of this.observers) obs.update(this.state);
    }

    setState(state: string): void {
        this.state = state;
        this.notify();
    }
}

class ConsoleObserver implements IObserver {
    constructor(private label: string) {}
    update(data: string): void {
        console.log(`[${this.label}] Получено обновление: ${data}`);
    }
}

// Примеры использования
function runExamples(): void {
    console.log("1 & 2. User\n");
    const u1: IUser = new User("Alice", 25);
    u1.hello();
    const u2: UserType = new UserWithTypeAlias("Bob", 30);
    u2.hello();

    console.log("3. Distance Overloads\n");
    console.log(distance(1, 2, 4, 6)); // 5
    console.log(distance({ x: 1, y: 2 }, { x: 4, y: 6 })); // 5

    console.log("4. Binary Search Tree\n");
    const bst = new BinarySearchTree();
    bst.insert(5); bst.insert(3); bst.insert(8); bst.insert(1); bst.insert(4);
    console.log("Search 3:", bst.search(3)); // true
    console.log("Height:", bst.height()); // 3
    bst.update(8, 7);
    console.log("Search 8 after update:", bst.search(8)); // false
    console.log("Search 7 after update:", bst.search(7)); // true
    bst.delete(3);
    console.log("Search 3 after delete:", bst.search(3)); // false

    console.log("5. Design Patterns\n");
    // Adapter
    const adaptee = new Adaptee();
    const adapter = new Adapter(adaptee);
    console.log(adapter.request());

    // Strategy
    const ctx = new StrategyContext(new AddStrategy());
    console.log("Add:", ctx.execute(5, 3)); // 8
    ctx.setStrategy(new MultiplyStrategy());
    console.log("Multiply:", ctx.execute(5, 3)); // 15

    // Observer
    const subject = new Subject();
    const phoneObs = new ConsoleObserver("Phone");
    const tvObs = new ConsoleObserver("TV");
    subject.attach(phoneObs);
    subject.attach(tvObs);
    subject.setState("Temperature: 22°C");
    subject.detach(phoneObs);
    subject.setState("Temperature: 23°C");
}

// Запуск
runExamples();