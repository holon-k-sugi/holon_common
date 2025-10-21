class LazyEvaluationFunctions {
  static setFunction(func) {
    if (func === undefined) this[func.name] = () => { console.warn(`LazyEvaluationFunctions.${func.name} は未定義`); };
    this[func.name] = func;
  }
}
