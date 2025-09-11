class Counter {
  count: number = $state(0);

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

export const counter = new Counter();
