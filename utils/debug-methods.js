export function debugMethods(obj, excludes) {
  return new Proxy(obj, {
    get: function(target, name, receiver) {
      if (typeof target[name] === 'function' && !excludes.includes(name)) {
        return function(...args) {
          const methodName = name;
          console.group(methodName);
          console.log(...args);
          console.groupEnd();
          return target[name](...args);
        };
      } else if (target[name] !== null && typeof target[name] === 'object') {
        return debugMethods(target[name], excludes);
      } else {
        return Reflect.get(target, name, receiver);
      }
    },
  });
}
