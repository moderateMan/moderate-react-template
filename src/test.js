import { cloneDeep } from "lodash";
(function(){
    class A {
        count = 0;
        async foo() {
            debugger
          this.count++;
          return this;
        }
        async bar() {
          this.count++;
          return this;
        }
      }
    let test = new Proxy(A, {
        construct: function (target, argumentsList, newTarget) {
          let ins = new target();
          ins.bar = new Proxy(ins.bar, {
            apply(target, arglist, newTarget) {
              Reflect.apply(target,arglist,newTarget)
              return ins;
            },
          });
          ins.foo = new Proxy(ins.foo, {
            apply(target, arglist, newTarget) {
              Reflect.apply(target,arglist,newTarget)
              return ins;
            },
          });
          return ins;
        },
      });
      let tt = new test();
      tt.bar().foo();
      tt.foo().bar();
      console.log(tt.count);
})()