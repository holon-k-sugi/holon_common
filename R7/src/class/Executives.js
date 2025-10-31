class Executives {
  static #list = [];

  static initialize(executivesList) {
    this.#list = JSON.parse(InputObjects.getValue(executivesList) || '[]');
  }

  static getNumOfExecutives() {
    return this.#list.length;
  }

  static getValue(type, index) {
    const value = this.#list?.[type]?.[index] || '';
    return value || '';
  }
}
