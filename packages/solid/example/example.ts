import { Mixin } from "ts-mixer";

class Foo {
  protected makeFoo() {
    return "foo";
  }
}

class Bar {
  protected makeFoo() {
    return "bar";
  }
}

class FooBar extends Mixin(Foo, Bar) {
  public makeFooBar() {
    return this.makeFoo() + this.makeFoo();
  }
}

const fooBar = new FooBar();
console.log(fooBar.makeFooBar());
