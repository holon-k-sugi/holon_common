class LazyEvaluationFunctions {
  static setFunction(name, func) {
    if (func === undefined) this[name] = () => { console.warn(`LazyEvaluationFunctions.${name} は未定義`); };
    this[name] = func;
  }
}
